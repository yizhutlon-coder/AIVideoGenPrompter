# ComfyUI code architecture & integration surfaces — what Prompt Studio can actually hook into

**Purpose:** decide, from the *source*, how much tighter than "download a JSON, drag it onto the canvas" Prompt Studio can get. Companion to [`comfyui-painpoints.md`](comfyui-painpoints.md) (lifecycle misery) and [`comfyui-ux-research.md`](comfyui-ux-research.md) (canvas/frontend UX). This file is about **code**: routes, middlewares, the execution cache, `/object_info`, the JS extension API, and workflow ingestion.

**All source read on 2026-09-01** from `Comfy-Org/ComfyUI@master` and `Comfy-Org/ComfyUI_frontend@main` (raw blob views). Line numbers are from that day's `master`; they will drift. Names and behaviour are the durable part.

### Evidence labels

| Label | Meaning |
|---|---|
| `[OFFICIAL-SRC]` | Read directly from ComfyUI / ComfyUI_frontend source on GitHub. Quoted verbatim where load-bearing. |
| `[OFFICIAL-DOC]` | docs.comfy.org |
| `[USER]` | GitHub issue text, attributed |
| `[INFERRED]` | My reasoning from the source, **not** empirically tested against a running ComfyUI |
| `[NOT FOUND]` | Searched for, does not appear to exist |

> **Honesty caveat that matters for section 6.** I read code; I did not run a ComfyUI instance and fire cross-origin requests at it. Everything about *browser* behaviour (what `Sec-Fetch-Site` Chrome sends from a `file://` page, whether the CORS preflight actually succeeds) is `[INFERRED]` from the middleware source plus the Fetch spec. Before shipping tier (b) or (c), **this needs a 20-minute empirical test** against a real 8188. I flag every inferred step below.

---

## 1. Server architecture

### 1.1 Everything is aiohttp, and there is no authentication

`server.py` builds one `web.Application`. There is **no login, no token, no session cookie** for a local ComfyUI. The only user concept is `--multi-user`, which reads an unauthenticated `comfy-user` request header:

```python
def get_request_user_id(self, request):
    user = "default"
    if args.multi_user and "comfy-user" in request.headers:
        user = request.headers["comfy-user"]
```
— `app/user_manager.py` L59-62 `[OFFICIAL-SRC]`

The Comfy account / API-key machinery is exclusively for Cloud and paid Partner (API) nodes; it does not gate any local route. `[OFFICIAL-DOC]` <https://docs.comfy.org/development/comfyui-server/api-key-integration>

**The only thing standing between a random web page and your GPU is a middleware.** That middleware is the entire security story, and it is the crux of this document.

### 1.2 The three middlewares, and the exact `--enable-cors-header` semantics

```python
middlewares = [cache_control, deprecation_warning]
if args.enable_compress_response_body:
    middlewares.append(compress_body)

if args.enable_cors_header:
    middlewares.append(create_cors_middleware(args.enable_cors_header))
else:
    middlewares.append(create_origin_only_middleware())

if args.disable_api_nodes:
    middlewares.append(create_block_external_middleware())
```
— `server.py` L232-242 `[OFFICIAL-SRC]`

This is an **either/or**, not an and. `--enable-cors-header` does not *add* CORS on top of the origin check — **it replaces the origin check entirely.** That is the single most important fact in this file.

**The flag definition:**

```python
parser.add_argument("--enable-cors-header", type=str, default=None, metavar="ORIGIN",
    nargs="?", const="*",
    help="Enable CORS (Cross-Origin Resource Sharing) with optional origin or allow all with default '*'.")
```
— `comfy/cli_args.py` L67 `[OFFICIAL-SRC]`

So precisely:

| Invocation | `args.enable_cors_header` | Effect |
|---|---|---|
| *(omitted)* | `None` (falsy) | `origin_only_middleware` installed. Cross-origin blocked. **This is the default.** |
| `--enable-cors-header` | `"*"` | CORS middleware with `Access-Control-Allow-Origin: *`. Origin check **removed**. |
| `--enable-cors-header null` | `"null"` | `ACAO: null` — matches a `file://` page's opaque origin exactly. Origin check removed. |
| `--enable-cors-header http://127.0.0.1:5500` | that string | `ACAO:` that exact origin. Origin check removed. |

The CORS middleware itself:

```python
def create_cors_middleware(allowed_origin: str):
    @web.middleware
    async def cors_middleware(request: web.Request, handler):
        if request.method == "OPTIONS":
            # Pre-flight request. Reply successfully:
            response = web.Response()
        else:
            response = await handler(request)

        response.headers['Access-Control-Allow-Origin'] = allowed_origin
        response.headers['Access-Control-Allow-Methods'] = 'POST, GET, DELETE, PUT, OPTIONS, PATCH'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response
    return cors_middleware
```
— `server.py` L115-130 `[OFFICIAL-SRC]`

Two notes:
- Preflight `OPTIONS` is short-circuited **before** the handler, so a JSON `POST /prompt` preflight succeeds even though no route registers `OPTIONS`. Good.
- It always sets `Access-Control-Allow-Credentials: true` **and** possibly `ACAO: *`. That combination is illegal per the Fetch spec *if the request is made with `credentials: 'include'`* — the browser will reject the response. Cross-origin `fetch()` defaults to `credentials: 'same-origin'`, i.e. credentials omitted, so `ACAO: *` is accepted. **Prompt Studio must therefore never set `credentials: 'include'` on ComfyUI calls.** `[INFERRED]`

### 1.3 The default origin check — why `file://` and a different localhost port both fail

```python
def create_origin_only_middleware():
    @web.middleware
    async def origin_only_middleware(request: web.Request, handler):
        if 'Sec-Fetch-Site' in request.headers:
            sec_fetch_site = request.headers['Sec-Fetch-Site']
            if sec_fetch_site == 'cross-site':
                return web.Response(status=403)
        #this code is used to prevent the case where a random website can queue comfy workflows by making a POST to 127.0.0.1 which browsers don't prevent for some dumb reason.
        #in that case the Host and Origin hostnames won't match
        #I know the proper fix would be to add a cookie but this should take care of the problem in the meantime
        if 'Host' in request.headers and 'Origin' in request.headers:
            host = request.headers['Host']
            origin = request.headers['Origin']
            host_domain = host.lower()
            parsed = urllib.parse.urlparse(origin)
            origin_domain = parsed.netloc.lower()
            host_domain_parsed = urllib.parse.urlsplit('//' + host_domain)

            #limit the check to when the host domain is localhost, this makes it slightly less safe but should still prevent the exploit
            loopback = is_loopback(host_domain_parsed.hostname)

            if parsed.port is None: #if origin doesn't have a port strip it from the host to handle weird browsers, same for host
                host_domain = host_domain_parsed.hostname
            if host_domain_parsed.port is None:
                origin_domain = parsed.hostname

            if loopback and host_domain is not None and origin_domain is not None and len(host_domain) > 0 and len(origin_domain) > 0:
                if host_domain != origin_domain:
                    logging.warning("WARNING: request with non matching host and origin {} != {}, returning 403".format(host_domain, origin_domain))
                    return web.Response(status=403)
        ...
```
— `server.py` L159-197 `[OFFICIAL-SRC]`

This is the loopback-CSRF hardening (the comment names the exact attack). Tracing it for our two cases:

**Case A — Prompt Studio opened as `file:///C:/.../PromptStudio.html`, fetching `http://127.0.0.1:8188/prompt`:**
- `Origin: null` (opaque origin). `urlparse("null").netloc` is `""` → `origin_domain` is empty → `len(origin_domain) > 0` is False → **the Host/Origin comparison is skipped entirely.** It would pass.
- But Chrome sends `Sec-Fetch-Site: cross-site` for a request whose initiator is an opaque origin → the very first check returns **403**. `[INFERRED]`
- Net: **blocked by default.**

**Case B — Prompt Studio served from `http://127.0.0.1:5500` (a Live Server / `python -m http.server`), fetching `http://127.0.0.1:8188/prompt`:**
- `Sec-Fetch-Site` is computed ignoring port, so this is `same-site`, not `cross-site` → first check passes. `[INFERRED]`
- `Host: 127.0.0.1:8188`, `Origin: http://127.0.0.1:5500`. Both have explicit ports, so neither gets stripped. `host_domain = "127.0.0.1:8188"`, `origin_domain = "127.0.0.1:5500"`. `is_loopback("127.0.0.1")` → True. They differ → **403**.
- Net: **blocked by default.** A different port on localhost is *not* trusted. This is deliberate.

**Case C — an extension's JS running inside the ComfyUI page itself (`http://127.0.0.1:8188`):** same-origin, no CORS, no middleware objection. Always works. This is why tier (d) below is architecturally the cleanest.

There is no way to make cases A or B work without `--enable-cors-header`. There is no per-origin allowlist file, no setting in the ComfyUI settings dialog, no `--allow-origin`. `[NOT FOUND]`

Also note: **WebSockets are not subject to CORS**, but they *are* subject to this middleware — Chrome sends `Sec-Fetch-Site` on the WS handshake too. So `/ws` is blocked by the same 403 in cases A and B, and unblocked by the same flag. `[INFERRED]`

### 1.4 The route table

Every route is registered twice — bare and under `/api`:

```python
# Prefix every route with /api for easier matching for delegation.
# This is very useful for frontend dev server, which need to forward
# everything except serving of static files.
# Currently both the old endpoints without prefix and new endpoints with
# prefix are supported.
api_routes = web.RouteTableDef()
for route in self.routes:
    # Custom nodes might add extra static routes. Only process non-static
    # routes to add /api prefix.
    if isinstance(route, web.RouteDef):
        api_routes.route(route.method, "/api" + route.path)(route.handler, **route.kwargs)
self.app.add_routes(api_routes)
self.app.add_routes(self.routes)
```
— `server.py` L1228-1240 `[OFFICIAL-SRC]`

**Prefer the `/api/...` form** in any client we write. The bare form is legacy-compat and one day will collide with the static file server mounted at `/`.

The ones that matter to us:

| Route | Method | Notes |
|---|---|---|
| `/api/prompt` | POST | queue a graph. Body `{prompt, client_id?, prompt_id?, extra_data?, number?, front?, partial_execution_targets?}`. Returns `{prompt_id, number, node_errors}` or 400 `{error, node_errors}`. |
| `/api/prompt` | GET | queue info only (`{exec_info: {queue_remaining}}`) |
| `/api/object_info` | GET | full node schema dump, **including live model filename lists** — §3 |
| `/api/object_info/{node_class}` | GET | one node |
| `/api/queue` | GET/POST | inspect / clear / delete pending |
| `/api/history`, `/api/history/{prompt_id}` | GET/POST | results & outputs |
| `/api/jobs`, `/api/jobs/{job_id}`, `/api/jobs/{id}/cancel` | GET/POST | newer job API (`prompt_id == job_id`) |
| `/api/view` | GET | fetch an output image — §1.6 |
| `/api/upload/image`, `/api/upload/mask` | POST | multipart; returns `{name, subfolder, type}` |
| `/api/userdata/{file}` | GET/POST/DELETE | **read/write arbitrary files under `user/<user>/`** — §5.3 |
| `/api/workflow_templates` | GET | map of custom-node module → template names — §5.2 |
| `/api/system_stats`, `/api/features`, `/api/embeddings`, `/api/models/{folder}` | GET | |
| `/api/interrupt`, `/api/free` | POST | |
| `/ws` | WS | `?clientId=<sid>` to resume a session |

### 1.5 WebSocket protocol

```python
@routes.get('/ws')
async def websocket_handler(request):
    ws = web.WebSocketResponse()
    await ws.prepare(request)
    sid = request.rel_url.query.get('clientId', '')
    ...
    await self.send("status", {"status": self.get_queue_info(), "sid": sid}, sid)
```
— `server.py` L269-287 `[OFFICIAL-SRC]`

Connect to `ws://127.0.0.1:8188/ws` (optionally `?clientId=…`). The server immediately sends `status` containing the assigned `sid`. **Put that `sid` into `POST /prompt` as `client_id`** so targeted events route to you:

```python
if "client_id" in json_data:
    extra_data["client_id"] = json_data["client_id"]
```
— `server.py` L1117-1118 `[OFFICIAL-SRC]`

Optionally negotiate features by sending `{"type":"feature_flags","data":{...}}` as the **first** message; the server replies with its own `feature_flags` (`server.py` L302-312).

Events (`[OFFICIAL-DOC]` <https://docs.comfy.org/development/comfyui-server/comms_messages> plus source):

| Event | Payload |
|---|---|
| `status` | `{status:{exec_info:{queue_remaining}}, sid}` |
| `execution_start` | `{prompt_id}` |
| `execution_cached` | `{prompt_id, nodes:[…skipped node ids…]}` |
| `executing` | `{node, prompt_id}` — `node: null` means done |
| `progress` | `{node, prompt_id, value, max}` (legacy) |
| `progress_state` | `{prompt_id, nodes:{id:{value,max,state,…}}}` — the modern one, emitted by `WebUIProgressHandler._send_progress_state` (`comfy_execution/progress.py` L160-184) |
| `executed` | `{node, prompt_id, output}` — **only when a node returns a `ui` dict.** `SaveImage`'s `output.images` is `[{filename, subfolder, type}]` |
| `execution_success` | `{prompt_id, timestamp}` |
| `execution_error` / `execution_interrupted` | `{prompt_id, node_id, node_type, …}` |

Binary preview frames also arrive on the socket (gated behind the `supports_preview_metadata` feature flag, `comfy_execution/progress.py` L208).

### 1.6 `/view` — reading results back

```
GET /api/view?filename=<name>&subfolder=<sub>&type=output
             [&preview=webp;85] [&channel=rgb|rgba|a]
```
Guards: rejects leading `/` or `..` in `filename` (L539), and `commonpath` checks the subfolder (L551). `preview=webp;<quality>` transcodes server-side — **use this for thumbnails**, it saves pulling a 4 MB PNG. `type` maps through `folder_paths.get_directory_by_type` (`output` / `input` / `temp`). Dangerous content types (SVG/HTML/JS) are forced to `attachment` (L641-655).

---

## 2. Execution model

### 2.1 What the cache key is

The intermediate-results cache is `HierarchicalCache(CacheKeySetInputSignature)` by default (`execution.py` L135-137). The signature:

```python
async def get_node_signature(self, dynprompt, node_id):
    signature = []
    ancestors, order_mapping = self.get_ordered_ancestry(dynprompt, node_id)
    signature.append(await self.get_immediate_node_signature(dynprompt, node_id, order_mapping))
    for ancestor_id in ancestors:
        signature.append(await self.get_immediate_node_signature(dynprompt, ancestor_id, order_mapping))
    return to_hashable(signature)
```
— `comfy_execution/caching.py` L101-107 `[OFFICIAL-SRC]`

and the per-node part is `[class_type, IS_CHANGED_result]` plus every input (links replaced by `("ANCESTOR", index, socket)`) sorted by key (L109-127).

**Consequence:** a node's key depends on its own inputs *and its entire upstream subgraph*. Change the text in `CLIPTextEncode` and the `KSampler` key changes (correct — it must resample). But `CheckpointLoaderSimple` has **no** ancestors and its own input (`ckpt_name`) is unchanged, so **its key is unchanged and its output stays cached.** The graph cache does not evict the model.

### 2.2 So what *is* issue #14618?

`[USER]` Aamir3d, <https://github.com/Comfy-Org/ComfyUI/issues/14618> (open, label `Potential Bug`, 30+ participants, read 2026-09-01):

> Change the prompt to something else / ComfyUI takes time to load the model / Comfyui then starts the inference after loading the model again

The user's own attached log disproves the "graph cache invalidation" theory. On the changed-prompt run the log shows the **text encoder** being re-staged (`Requested to load Krea2TEModel_`, `prepared for dynamic VRAM loading. 8463MB Staged`), not the checkpoint being re-parsed. Reporter's environment: `ComfyUI version: 0.26.0`, RTX 3060 12 GB, `[INFO] Using RAM pressure cache`, `comfy-aimdo` DynamicVRAM active.

**The mechanism is memory management, not the execution cache.** `[INFERRED]` Changing the prompt makes the CLIP/TE node dirty, so the TE must actually run; on a VRAM-constrained card with `RAMPressureCache` + DynamicVRAM the TE weights had been evicted/unpinned, so "running it" means re-streaming multi-GB of weights from RAM or disk. The `objects` cache that holds *loaded model objects* is keyed by `CacheKeySetID` (node id only, `execution.py` L137) and is untouched by prompt edits.

Corroboration inside the thread:
- Another reporter: *"It seems this issue is fixed for me by using the `--cache-classic` argument."* — i.e. switching away from the RAM-pressure cache. `[USER]`
- Contributor **brendanhoar**: *"Did you pick up the following commit which was merged into master 9 hours ago? … It fixed my issues"* — commit `8084083`. Another user confirms with `comfy-aimdo 0.4.11`. `[USER]`
- The reporter says the behaviour is absent in v0.22 and present from v0.23 onward, and filed the narrower follow-up #15275 ("Text encoder … evicted/reloaded far more aggressively on v0.30 vs v0.22").

**What this means for Prompt Studio:** we cannot fix it, but we *can* name it correctly in the tutor/gotchas bank — and the actionable user advice (`--cache-classic`, or `--cache-ram` with a larger active threshold, or update `comfy-aimdo`) is concrete and correct. Do **not** repeat the folk explanation that "changing the prompt busts the model cache"; the graph cache is innocent.

### 2.3 Queue-time validation — what our exporter will be judged on

`POST /prompt` → `execution.validate_prompt(prompt_id, prompt, partial_execution_targets)` (`server.py` L1112). Failure returns **HTTP 400** with `{error, node_errors}`. Order of checks (`execution.py` L1128-1245):

1. **`class_type` missing** → `{"type": "missing_node_type", "message": "Node '<title>' has no class_type. The workflow may be corrupted or a custom node is missing."}` — returns immediately.
2. **`class_type` not in `NODE_CLASS_MAPPINGS`** → `{"type": "missing_node_type", "message": "Node '<title>' not found. The custom node may not be installed."}`, `extra_info: {node_id, class_type, node_title}` — returns immediately. **This is how a missing custom node surfaces: a clean, machine-readable 400, before anything loads.**
3. **No `OUTPUT_NODE` in the graph** → `{"type": "prompt_no_outputs"}`.
4. Then per-output `validate_inputs`, producing `node_errors[node_id] = {errors:[…], dependent_outputs:[…], class_type}`.

**Missing *models* are not caught here.** A combo value like `"my-lora.safetensors"` is validated against the node's declared option list at validation time if the node declares one, but a checkpoint that vanished after `/object_info` was cached will blow up at *execution* time as an `execution_error` over the websocket, not as a 400. `[INFERRED]`

The `_meta.title` field is read for error messages (L1133, L1150) — **our exporter should always emit `_meta: {title: …}`**, it costs nothing and makes ComfyUI's error text human-readable.

---

## 3. `/object_info` — the model-list goldmine. Verified live.

### 3.1 Yes, it reflects current disk contents

`INPUT_TYPES()` is called **per request**, and loader nodes call `folder_paths.get_filename_list(...)` *inside* it:

```python
class CheckpointLoaderSimple:
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "ckpt_name": (folder_paths.get_filename_list("checkpoints"), {"tooltip": "The name of the checkpoint (model) to load."}),
            }
        }
```
— `nodes.py` L616-623 `[OFFICIAL-SRC]`

```python
class LoraLoader:
    @classmethod
    def INPUT_TYPES(s):
        return {"required": {
            "model": ("MODEL", {...}), "clip": ("CLIP", {...}),
            "lora_name": (folder_paths.get_filename_list("loras"), {"tooltip": "The name of the LoRA."}),
            "strength_model": ("FLOAT", {"default": 1.0, "min": -100.0, "max": 100.0, "step": 0.01, ...}),
            "strength_clip": ("FLOAT", {"default": 1.0, ...}),
        }}
```
— `nodes.py` L709-725 `[OFFICIAL-SRC]`

The handler wraps the whole sweep in a request-scoped cache so all nodes see one consistent snapshot, then throws it away:

```python
@routes.get("/object_info")
async def get_object_info(request):
    asset_seeder.start(roots=("models", "input", "output"))
    with folder_paths.cache_helper:
        out = {}
        for x in nodes.NODE_CLASS_MAPPINGS:
            try:
                out[x] = node_info(x)
            except Exception:
                logging.error(f"[ERROR] An error occurred while retrieving information for the '{x}' node.")
```
— `server.py` L800-811 `[OFFICIAL-SRC]`

`CacheHelper.__exit__` calls `self.clear()` (`folder_paths.py` L100-102), and the *persistent* `filename_list_cache` is invalidated by directory **mtime** comparison:

```python
for x in out[1]:
    time_modified = out[1][x]
    folder = x
    if os.path.getmtime(folder) != time_modified:
        return None
```
— `folder_paths.py` L496-500 `[OFFICIAL-SRC]`

**Verdict: `GET /api/object_info` returns the user's actual, current, on-disk model and LoRA filenames.** Drop a new `.safetensors` into `models/loras` and the next call sees it — no restart, no "Refresh" click. This includes every path added via `extra_model_paths.yaml`.

Note one wrinkle: the mtime check is on the *directory*, so a file added to a **subdirectory** (`models/loras/flux/new.safetensors`) may not bump the tracked parent's mtime on every filesystem and could be missed until a restart. `[INFERRED]` Not a blocker; worth a "if you don't see your LoRA, restart ComfyUI" hint.

### 3.2 Exact shape

For classic (V1) nodes, `node_info()` returns (`server.py` L751-798):

```python
info['input'] = obj_class.INPUT_TYPES()          # {"required": {...}, "optional": {...}, "hidden": {...}}
info['input_order'] = {key: list(value.keys()) for (key, value) in obj_class.INPUT_TYPES().items()}
info['is_input_list'] = ...
info['output'] = obj_class.RETURN_TYPES
info['output_is_list'], info['output_name'], info['name'], info['display_name'],
info['description'], info['python_module'], info['category'], info['output_node'],
info['has_intermediate_output'], info['output_tooltips'], info['deprecated'],
info['experimental'], info['dev_only'], info['api_node'], info['search_aliases'],
info['essentials_category']
```

Each input is a 2-tuple → JSON 2-array `[typeSpec, opts]`:
- **socket input:** `["MODEL", {"tooltip": "..."}]`
- **numeric widget:** `["FLOAT", {"default":1.0,"min":-100.0,"max":100.0,"step":0.01,"tooltip":"..."}]`
- **combo (V1):** `[["v1-inpainting.ckpt","sd_xl_base_1.0.safetensors", …], {"tooltip":"..."}]` — **the type slot is literally the array of filenames.**

**Two shapes exist.** V3-schema nodes route through a different path:

```python
def node_info(node_class):
    obj_class = nodes.NODE_CLASS_MAPPINGS[node_class]
    if issubclass(obj_class, _ComfyNodeInternal):
        return obj_class.GET_NODE_INFO_V1()
```
— `server.py` L751-754 `[OFFICIAL-SRC]`

and `add_to_dict_v1` emits `d[key][i.id] = (i.get_io_type(), as_dict)` (`comfy_api/latest/_io.py` L1904-1909), where a `Combo` serialises its choices into `as_dict["options"]` (`_io.py` L381-389). So a V3 combo looks like:

```json
["COMBO", {"options": ["a.safetensors","b.safetensors"], "control_after_generate": false, ...}]
```

**Any client reading `/object_info` must handle both.** Concretely:

```js
function comboOptions(spec) {
  const [type, opts = {}] = spec;
  if (Array.isArray(type)) return type;                // V1
  if (type === 'COMBO' && Array.isArray(opts.options)) return opts.options; // V3
  return null;                                          // not a combo
}
```

This shape variance is exactly the kind of frontend/backend churn that will break us silently. Guard it.

### 3.3 Cost

`/object_info` is a full sweep of every registered node class, calling `INPUT_TYPES()` on each. On a machine with a lot of custom nodes it is a multi-megabyte response and a visible pause. **Fetch it once, cache in memory, offer a manual "Rescan" button.** Use `/api/object_info/{node_class}` when we only need one loader. There is also the lighter `/api/models/{folder}` (`server.py` L348) if all we want is filenames for one folder — this is the better call for populating a dropdown, and `/api/models` lists the folder names.

---

## 4. Frontend extension API

### 4.1 Registration and the (in)stability of it

Three steps, unchanged for years `[OFFICIAL-DOC]` <https://docs.comfy.org/custom-nodes/js/javascript_overview>:

> * Export `WEB_DIRECTORY` from your Python module,
> * Place one or more `.js` files into that directory,
> * Use `app.registerExtension` to register your extension.

```js
import { app } from "../../scripts/app.js";
app.registerExtension({ name: "a.unique.name...", async setup() { ... } })
```

The `ComfyExtension` interface (`src/types/comfy.ts`, read 2026-09-01) currently offers: `commands`, `keybindings`, `menuCommands`, `settings`, `bottomPanelTabs`, `aboutPageBadges`, `topbarBadges`, `actionBarButtons`, plus lifecycle hooks `init`, `setup`, `addCustomNodeDefs`, `getCustomWidgets`, `getSelectionToolboxCommands`, `getCanvasMenuItems`, `getNodeMenuItems`, `beforeRegisterNodeDef`, `beforeRegisterVueAppNodeDefs`, `registerCustomNodes`, `loadedGraphNode`, `nodeCreated`, `beforeLoadGraph`, `afterLoadGraph`, `beforeConfigureGraph`, `afterConfigureGraph`, `onNodeOutputsUpdated`, and auth hooks. It ends with `[key: string]: unknown`, so anything extra is tolerated.

**`sidebarTabs` is *not* on `ComfyExtension`.** Sidebar tabs go through the extension manager:

```js
app.extensionManager.registerSidebarTab({
  id: "customSidebar",
  icon: "pi pi-compass",
  title: "Custom Tab",
  tooltip: "My Custom Sidebar Tab",
  type: "custom",
  render: (el) => { el.innerHTML = '<div>This is my custom sidebar content</div>'; }
});
```
— `[OFFICIAL-DOC]` <https://docs.comfy.org/custom-nodes/js/javascript_sidebar_tabs>

Typed as (`src/types/extensionTypes.ts`, read 2026-09-01) `[OFFICIAL-SRC]`:

```ts
export interface CustomExtension {
  id: string
  type: 'custom'
  render: (container: HTMLElement) => void
  destroy?: () => void
}
export type SidebarTabExtension = VueSidebarTabExtension | CustomSidebarTabExtension

export interface ExtensionManager {
  registerSidebarTab(tab: SidebarTabExtension): void
  unregisterSidebarTab(id: string): void
  getSidebarTabs(): SidebarTabExtension[]
  toast: ToastManager
  dialog: ReturnType<typeof useDialogService>
  command: CommandManager
  setting: { get: …; set: … }
  workflow: ReturnType<typeof useWorkflowStore>
  lastNodeErrors: Record<string, NodeError> | null
  lastExecutionError: ExecutionErrorWsMessage | null
  renderMarkdownToHtml(markdown: string, baseUrl?: string): string
}
```

`type: 'custom'` with `render(container)` is **exactly** the hook we need: hand it a container, append an `<iframe>`, done. The surface we depend on is four properties wide. That is about as small a blast radius as ComfyUI offers.

Also available and cheap: `aboutPageBadges` (`{label, url, icon, severity?}`), `topbarBadges`, `actionBarButtons` (`{icon, label?, tooltip?, onClick}`), `bottomPanelTabs` (same `render(container)` contract), `commands` + `keybindings`, `settings`, and `extensionManager.toast` / `.dialog`.

**Stability, honestly:** `registerExtension`, `setup`, `beforeRegisterNodeDef`, `nodeCreated` are ancient and safe. `registerSidebarTab` has been stable across the whole v1.x frontend line and is *documented*, which is the real signal. The genuinely volatile stuff is the LiteGraph-internals surface (`app.graph`, `LGraphNode` prototype patching, widget internals) — precisely the surface an iframe-based tab **does not touch**. Note the ongoing Vue-node migration (`beforeRegisterVueAppNodeDefs`, `src/renderer/extensions/vueNodes/…`): another reason to stay out of node rendering entirely.

### 4.2 Web-only extensions: they work, with one cosmetic wart

`EXTENSION_WEB_DIRS` is populated **before** the node-mapping check:

```python
if hasattr(module, "WEB_DIRECTORY") and getattr(module, "WEB_DIRECTORY") is not None:
    web_dir = os.path.abspath(os.path.join(module_dir, getattr(module, "WEB_DIRECTORY")))
    if os.path.isdir(web_dir):
        EXTENSION_WEB_DIRS[module_name] = web_dir

# V1 node definition
if hasattr(module, "NODE_CLASS_MAPPINGS") and getattr(module, "NODE_CLASS_MAPPINGS") is not None:
    ...
    return True
# V3 Extension Definition
elif hasattr(module, "comfy_entrypoint"):
    ...
else:
    logging.warning(f"Skip {module_path} module for custom nodes due to the lack of NODE_CLASS_MAPPINGS or comfy_entrypoint (need one).")
    return False
```
— `nodes.py` L2286-2333 `[OFFICIAL-SRC]`

and the directories are served:

```python
# Add routes from web extensions.
for name, dir in nodes.EXTENSION_WEB_DIRS.items():
    self.app.add_routes([web.static('/extensions/' + name, dir)])
```
— `server.py` L1243-1244 `[OFFICIAL-SRC]`

So a JS-only extension **does** get its web dir registered and served — but `load_custom_node` returns `False`, which logs a scary warning and prints `(IMPORT FAILED)` next to it in the startup import-times table (`nodes.py` L2379-2386).

**The fix is one line.** Export an empty dict:

```python
# prompt_studio_comfy/__init__.py
NODE_CLASS_MAPPINGS = {}
NODE_DISPLAY_NAME_MAPPINGS = {}
WEB_DIRECTORY = "./js"
__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]
```

`getattr(module, "NODE_CLASS_MAPPINGS") is not None` is True, the loop over `{}` does nothing, `return True`. Clean startup log, zero nodes registered, JS served from `/extensions/prompt_studio_comfy/`.

There is also a `pyproject.toml` route that avoids `__init__.py` entirely — `[tool.comfy] web = "js"` registers the folder under the *project* name (`nodes.py` L2268-2282), which is the Registry-blessed form. `[OFFICIAL-DOC]` <https://docs.comfy.org/registry/specifications>

Non-`.js` assets are reachable at `/extensions/<module>/<file>` but must be loaded programmatically — only `.js` is auto-injected. `[OFFICIAL-DOC]`

---

## 5. Workflow ingestion

### 5.1 Drag-and-drop accepts API-format JSON directly

`ComfyApp.addDropHandler()` (`src/scripts/app.ts` L699-800) listens on `document` for `drop`, and routes files to `handleFile(file, 'file_drop', …)`. `handleFile` (L1998+):

```ts
const workflowData = await getWorkflowDataFromFile(file)
const { workflow, prompt, parameters, templates } = workflowData ?? {}
...
if (workflow)  { ... await this.loadGraphData(workflowObj, true, true, fileName, {...}); return }
if (prompt) {
  const promptObj = typeof prompt === 'string' ? parseJsonWithNonFinite<ComfyApiWorkflow>(prompt) : prompt
  if (this.isApiJson(promptObj)) {
    await this.loadApiJson(promptObj, fileName, { deferWarnings: options?.deferWarnings })
    return
  }
}
// Use parameters strictly as the final fallback  → importA1111(...)
```
`[OFFICIAL-SRC]`

So a dropped file can be: a **full workflow JSON** (nodes/links/positions), an **API-format JSON** (which `loadApiJson` reconstructs into a laid-out graph, L2266+), a **PNG/WebP with embedded `workflow`/`prompt` metadata**, an A1111 `parameters` string, or a media file (→ `LoadImage`/`LoadAudio`/`LoadVideo` node created and populated).

**This is why the status quo works as well as it does, and it is worth stating plainly: our current "export API JSON → user drags it in" path is a first-class, intentionally-supported ingestion route, not a hack.** `loadApiJson` even remaps subgraph-flattened ids (`"194:45"` → `"194_45"`) so exports from subgraph workflows don't break.

Multi-file drops go to `handleFileList` (L2171), which batch-creates media nodes and positions them (L2210).

### 5.2 Template deep-links — `?template=` is real and it works for custom nodes

`src/platform/workflow/templates/composables/useTemplateUrlLoader.ts` (read 2026-09-01) `[OFFICIAL-SRC]`:

> Supports URLs like:
> - `/?template=flux_simple` (loads with default source)
> - `/?template=flux_simple&source=custom` (loads from custom source)
> - `/?template=flux_simple&mode=linear` (loads template in linear mode)

Params are validated with `/^[a-zA-Z0-9_.-]+$/` and stripped from the URL after load. Resolution (`useTemplateWorkflows.ts` L156-163):

```ts
const fetchTemplateJson = async (id: string, sourceModule: string) => {
  if (sourceModule === 'default') {
    return fetch(api.fileURL(`/templates/${id}.json`)).then((r) => r.json())
  }
  return fetch(api.apiURL(`/workflow_templates/${sourceModule}/${id}.json`))...
}
```

And the backend serves exactly that, for **any** loaded custom-node module that has an `example_workflows/` (or `example`, `examples`, `workflow`, `workflows`) folder:

```python
example_workflow_folder_names = ["example_workflows", "example", "examples", "workflow", "workflows"]
...
for module_name, module_dir in loadedModules:
    for folder_name in example_workflow_folder_names:
        workflows_dir = os.path.join(module_dir, folder_name)
        if os.path.exists(workflows_dir):
            webapp.add_routes([web.static("/api/workflow_templates/" + module_name, workflows_dir)])
```
— `app/custom_node_manager.py` L94-138 `[OFFICIAL-SRC]`

`loadedModules` is `nodes.LOADED_MODULE_DIRS` (`server.py` L1223), which is set for **every** module that imported, including a JS-only one (`nodes.py` L2265, before the mappings check). So:

**A `prompt-studio-comfy` extension can ship a library of our workflows, they appear in the Template Browser, and any link of the form `http://127.0.0.1:8188/?template=wan22_i2v_lora&source=prompt_studio_comfy` opens one on the canvas.** That is a genuine deep-link from Prompt Studio into ComfyUI that requires no CORS at all — it's a plain navigation.

Limitation: templates are **static files**, chosen by name. You cannot deep-link a *parameterised* workflow (our prompt text baked in) this way. `?template=` selects; it does not carry a payload.

### 5.3 `/userdata` — writing a workflow straight into the user's workflow browser

```python
@routes.post("/userdata/{file}")
async def post_userdata(request):
    """
    Upload or update a user data file.
    ...
    Query Parameters:
    - overwrite (optional): If "false", prevents overwriting existing files. Defaults to "true".
    ...
    The request body should contain the raw file content to be written.
    """
```
— `app/user_manager.py` L364-389 `[OFFICIAL-SRC]`

Path safety is real (`get_request_user_filepath`, L72-103): URL-decodes `%`, `os.path.abspath` joins, and rejects anything escaping the user root via `commonpath`. Files land under `user/<user_id>/`.

The frontend's workflow browser reads exactly that tree — `ComfyWorkflow.basePath` is `'workflows/'`, and `workflowStore.ts` calls `api.getUserData('workflows/.index.json')` / `api.storeUserData(...)` and lists `'workflows/' + dir` (L290, L413, L765-773) `[OFFICIAL-SRC]`.

**So `POST /api/userdata/workflows%2FPromptStudio%2Fmy-shot.json` with the full workflow JSON as the raw body puts our workflow into the user's sidebar, permanently, no drag needed.** They click it and it opens. This is a *much* better UX than a download, and it is a plain POST — no `/prompt`, no queueing, nothing that touches the GPU. It is subject to the same CORS gate as everything else (§1.3).

Two caveats: the workflow browser expects the **full** workflow format (positions/links), not API format — our exporter would need a second output mode. And writing files into the user's directory from a foreign origin is exactly what `origin_only_middleware` exists to prevent, so we must never encourage this without the user knowingly enabling the flag.

### 5.4 Clipboard / postMessage — what does *not* exist

- **Pasting workflow JSON as text onto the canvas:** `[NOT FOUND]`. The paste path in `app.ts` is LiteGraph's node clipboard (`localStorage['litegrapheditor_clipboard']`, L1199-1232, used by node *templates*) plus image/audio/video paste (`usePaste`). There is no "parse clipboard text as a workflow" handler. Pasting an *image* that has embedded workflow metadata does work, via the same `handleFile` path.
- **`postMessage` API for loading a workflow into an embedded ComfyUI:** `[NOT FOUND]` in `src/scripts/app.ts`. The only "host" channel is the Electron bridge `window.__comfyDesktop2?.Telemetry` (`src/platform/telemetry/initHostTelemetry.ts`) — Comfy Desktop, not iframes. `src/utils/hostWhitelist.ts` is about enabling SSO on loopback hosts, not embedding. **Do not design anything around driving ComfyUI from a parent frame.**
- **`?workflow=<url>` or `?workflowId=`:** `[NOT FOUND]`. Only `?template=`/`&source=`/`&mode=`.

---

## 6. Integration tiers — effort, fragility, and whether it breaks our ethos

Our constraints, restated so the trade-offs are honest: **one HTML file, zero install, runs from `file://`, no build step, no server of our own, works offline.** Anything that requires the user to run an installer, edit a `.bat`, or restart ComfyUI is a real cost, not a rounding error.

### (a) Status quo — download JSON, drag onto canvas
- **Effort:** zero (shipped).
- **Fragility:** ~none. `handleFile` → `loadApiJson` is core, well-tested, and used by every workflow-sharing site on the internet (§5.1).
- **Ethos:** perfect. Single file, no origin, no flags.
- **Friction:** 4 user actions (Export → find in Downloads → switch window → drag). Loses the round trip: we never see the result.
- **Verdict:** **keep as the always-available baseline.** Every other tier degrades to this.

### (b) Direct queue — `POST /prompt` + `/ws` + `/view` preview inside Prompt Studio
- **What it buys:** the real prize. Type prompt → Queue → watch `progress_state` → see the image in our own UI → iterate. That is the loop the whole product wants.
- **Blocker:** §1.3. From `file://` this is a **403 by default**, from a different localhost port also **403 by default**. The *only* unlock is `--enable-cors-header` (or `--enable-cors-header null`), which **removes `origin_only_middleware` for every origin, permanently, for that session.**
- **Effort:** the client is easy — maybe 200 lines (POST, WS, event switch, `<img src="/api/view?...&preview=webp;85">`). The hard part is the flag.
- **Fragility of the API itself:** low. `/prompt`, `/ws`, `/view`, `/history` are the most stable surfaces in the codebase; the whole third-party ecosystem depends on them. Use `/api/`-prefixed paths. Handle both `progress` and `progress_state`.
- **Ethos:** **this is where it breaks.** Not because of our code, but because we would be asking users to weaken a security control that exists specifically to stop drive-by web pages from driving their GPU and reading `/view` and `/userdata`. With `--enable-cors-header *`, *any* website the user visits can queue prompts, enumerate their models via `/object_info`, read their outputs via `/view`, and write files via `/userdata`.

**On "could our launcher add the flag to a ComfyUI shortcut safely?"** — the mechanics are trivial (`--enable-cors-header` appended in `run_nvidia_gpu.bat`; `[OFFICIAL-DOC]` startup-flags explicitly documents editing the portable `.bat`). **My recommendation is: do not ship anything that edits the user's launcher.** Reasons, in order of weight:
1. We would be silently disabling a CSRF control, and the user would not understand what they agreed to.
2. It contradicts the zero-install ethos more than any other option here — we'd become a thing that modifies files outside its own folder.
3. `--enable-cors-header *` is far broader than we need.

If tier (b) is pursued anyway, the **least-bad** version is: Prompt Studio *detects* the situation (attempt a `GET /api/system_stats`; on network error / 403, show a panel), explains in plain language what the flag does and what it exposes, shows the exact command **for the user to copy and run themselves**, and recommends the narrowest form. The narrowest forms are:
- served from a fixed local port: `--enable-cors-header http://127.0.0.1:5500`
- opened as `file://`: `--enable-cors-header null`

Both still delete `origin_only_middleware` — the header value narrows what the *browser* will let read a response, but any site can still *send* state-changing requests. Say that out loud in the UI.
- **Verdict:** highest value, highest ethical cost. **Ship as an explicitly opt-in "Advanced: connect to ComfyUI" mode with an honest warning. Never auto-configure.**

### (b′) Write to `/userdata/workflows/` — "Save to ComfyUI" instead of "Download"
- Same CORS gate as (b), same 403 by default. But **if** the user has opted in, this is a nicer, lower-stakes win than queueing: the workflow appears in their sidebar under a `PromptStudio/` folder, they open it and hit Run themselves. No GPU driven from our page.
- **Effort:** small (one POST) + a full-workflow-format exporter (positions/links) alongside our API-format one. That exporter is genuinely non-trivial — laying out nodes is real work.
- **Verdict:** good companion to (b); not worth the flag on its own.

### (c) Read `/object_info` (or `/api/models/{folder}`) to real-ify our dropdowns
- **What it buys:** the single highest-value-per-line item in this document. Our workflow exporter stops emitting `"wan2.2_i2v_high_noise_14B_fp8_scaled.safetensors"` (an official default the user probably doesn't have, producing the #1 red-node/"model not found" failure) and instead emits a filename that **provably exists on their disk** (§3.1). Plus a LoRA picker populated from their actual `models/loras`.
- **Blocker:** it is a `GET`, but it is still cross-origin → **same 403 by default.** There is no read-only exemption. This is the frustrating part: the *safest* integration is gated behind the *same* switch as the most dangerous one.
- **Effort:** small. One fetch, one parser that handles both combo shapes (§3.2), cache it, "Rescan" button. `/api/models/{folder}` is much lighter if we only want filenames.
- **Fragility:** medium-low. The V1/V3 dual shape is a live churn risk — write the tolerant helper, don't assume.
- **Ethos:** the *feature* is perfectly aligned (offline, local, no telemetry). The *access requirement* is not.
- **Verdict:** **the thing most worth having.** If a user has already enabled the flag for (b), (c) is free and should be automatic. And there is a zero-flag fallback that captures most of the value: **let the user paste their `/object_info` or `/api/models/loras` JSON** — or drop the file — into Prompt Studio. They open `http://127.0.0.1:8188/api/models/loras` in a browser tab, copy, paste. Ugly, but it is 100% offline, needs no flag, needs no install, and gets us real filenames. **Build this first.**

### (d) Ship `prompt-studio-comfy` — a web-only custom node that mounts Prompt Studio as a sidebar tab
- **How:** a folder in `custom_nodes/` containing `__init__.py` (with `NODE_CLASS_MAPPINGS = {}` + `WEB_DIRECTORY = "./js"`, §4.2), `js/prompt-studio.js` (~30 lines), and `js/app.html` (our single file, verbatim). The JS does:
  ```js
  app.registerExtension({
    name: "promptstudio.sidebar",
    async setup() {
      app.extensionManager.registerSidebarTab({
        id: "promptStudio", icon: "pi pi-pencil", title: "Prompt Studio",
        tooltip: "Prompt Studio", type: "custom",
        render: (el) => {
          const f = document.createElement("iframe");
          f.src = "/extensions/prompt_studio_comfy/app.html";
          f.style.cssText = "width:100%;height:100%;border:0";
          el.appendChild(f);
        }
      });
    }
  });
  ```
- **`file://` in an iframe is impossible** — correct, and irrelevant, because the whole point is that the extension is *served from ComfyUI's own origin*. `/extensions/prompt_studio_comfy/app.html` is `http://127.0.0.1:8188`, i.e. **same-origin with ComfyUI**.
- **This is the killer property: same-origin means no CORS, no flag, no security downgrade.** From inside that iframe, `fetch('/api/object_info')`, `POST /api/prompt`, `/ws`, `/view`, `/userdata` all just work, today, on a stock default-configured ComfyUI. Tiers (b), (b′) and (c) all come free the moment we're inside the origin. And it can talk to Ollama at `127.0.0.1:11434`... **with one caveat: Ollama itself needs `OLLAMA_ORIGINS` to include `http://127.0.0.1:8188`, because now *we* are the cross-origin caller.** The CORS problem doesn't vanish, it moves — but it moves to a service where the fix is a documented env var rather than disabling a CSRF control. Worth verifying empirically. `[INFERRED]`
- **Better than the iframe:** we can `parent.app.extensionManager.toast`, read `lastNodeErrors`, register commands/keybindings, add an about-page badge, and drop a workflow onto the canvas via the host `app`. An iframe walls us off from those; a same-origin iframe can still reach `window.parent` if we want them.
- **Effort:** medium. The JS shim is trivial. The real work: (i) our HTML must be *embeddable* — narrow-column responsive layout, dark theme matching ComfyUI's CSS vars, no `<title>`-driven chrome; (ii) packaging + a `pyproject.toml` for the Comfy Registry; (iii) a release process (two artifacts to keep in sync, or one built from the other).
- **Fragility:** the API surface we consume is four properties of `registerSidebarTab` plus `registerExtension`. Both documented, both stable across v1.x. We touch **zero** LiteGraph internals, so the Vue-node migration can't hurt us. This is the most churn-resistant integration available.
- **Ethos:** **this is the honest tension.** It is an *install*: download/clone a folder into `custom_nodes/`, restart ComfyUI. That is not zero-install. Mitigations: the same single HTML file remains the primary, unchanged product; the extension is a thin wrapper *around* that file, not a fork; and the install is a folder copy, not a pip dependency (nothing to break, nothing to compile — `NODE_CLASS_MAPPINGS = {}` means it cannot cause an import error). Distributed via ComfyUI-Manager/Registry it becomes a two-click install for most users — though note Manager now requires `--enable-manager` (`[OFFICIAL-DOC]` startup-flags), so a manual folder copy remains the fallback path.
- **Verdict:** **architecturally correct, and the only tier that gets full integration without asking anyone to weaken anything.** It costs us "zero-install" and nothing else.

### (e) Other surfaces the source suggests

1. **Ship workflow templates with the extension** (§5.2). Any `example_workflows/*.json` in the extension folder is served at `/api/workflow_templates/prompt_studio_comfy/<name>.json`, listed in the Template Browser, and deep-linkable as `?template=<name>&source=prompt_studio_comfy`. **Near-zero effort once (d) exists**, and it is the natural home for our curated per-model workflows.
2. **`?template=` deep-links from the standalone HTML** — a plain `<a href="http://127.0.0.1:8188/?template=…&source=prompt_studio_comfy">` is a *navigation*, not a fetch, so **no CORS applies at all.** If (d) is installed, the `file://` app can still say "Open this workflow in ComfyUI" and it works. Nice hybrid.
3. **Embedded-metadata export.** `handleFile` reads `workflow`/`prompt` from PNG metadata. We could export a PNG (or reference card) carrying the workflow, so dragging a *picture* loads the graph. Cute; low priority.
4. **`aboutPageBadges` / `topbarBadges` / `actionBarButtons`** — cheap discoverability once (d) exists.
5. **Node-error tutoring.** `extensionManager.lastNodeErrors` and `lastExecutionError` are exposed to extensions. Combined with our gotchas bank, a sidebar that *explains the red node the user is currently staring at* is a strong differentiator. Requires (d).
6. **`/api/features` capability probe.** Cheap, tiny response — a good "is ComfyUI reachable and what version-ish is it" ping.
7. **`--cache-classic` advice** for the #14618 memory thrash (§2.2). Pure content, zero integration, immediately useful.

### Summary table

| Tier | Effort | Fragility | Needs a flag? | Needs install? | Ethos cost |
|---|---|---|---|---|---|
| (a) download → drag | none | very low | no | no | none |
| (b) direct `POST /prompt` + ws | medium | low | **yes, `--enable-cors-header`** | no | **high** — user disables a CSRF control |
| (b′) `POST /userdata` save | medium | low | **yes, same** | no | high (same) |
| (c) `/object_info` dropdowns | low | med-low | **yes, same** | no | high (same) |
| (c-lite) paste `/api/models/loras` JSON | very low | very low | no | no | none |
| (d) sidebar-tab extension | medium | **lowest** | **no** | **yes** (folder copy + restart) | "zero-install" only |
| (e1) ship templates | very low | low | no | yes (rides on d) | rides on (d) |
| (e2) `?template=` deep-link | very low | low | no | yes (rides on d) | rides on (d) |

---

## 7. Recommendation

**Two-track, and be explicit with users about which track they're on.**

**Track 1 — keep the single file pure.** Tier (a) stays the default forever. Add **(c-lite)**: a "Paste your model list" box that ingests `/api/models/loras` (or a full `/object_info`) pasted or dropped in, and uses it to populate real dropdowns in the exporter. This is the highest value-to-cost item in the whole document: it kills the "model not found" red-node failure, needs no flag, no install, no network, and cannot break when ComfyUI churns.

**Track 2 — build (d), the `prompt-studio-comfy` web-only extension.** It is the only path to the full loop (real model lists + one-click queue + inline result preview + node-error tutoring) that does **not** require anyone to disable ComfyUI's cross-origin protection, because same-origin makes the entire CORS question disappear. The API surface we lean on is documented, stable, and doesn't touch LiteGraph internals. The price is one folder copy and a restart — a real cost, but a much smaller and more honest one than "please make your GPU reachable from any website you visit."

**Explicitly decline tier (b) as a default.** Offer it only as a clearly-labelled advanced mode, with a plain-language warning about what `--enable-cors-header` removes, and **never** write to the user's `.bat` or shortcut.

**Before writing any code for (b), (b′) or (c): run the 20-minute empirical test.** Every claim in §1.3 about browser behaviour is `[INFERRED]` from source + spec. Stand up a stock ComfyUI, open a `file://` page and a `http://127.0.0.1:5500` page, and confirm the 403s and the flag's effect. If the inference is wrong in either direction, the recommendation shifts.

---

## Source index (all accessed 2026-09-01)

**ComfyUI core** — `Comfy-Org/ComfyUI@master`, blob/raw views:
- `server.py` — <https://github.com/Comfy-Org/ComfyUI/blob/master/server.py>
- `comfy/cli_args.py` — <https://github.com/Comfy-Org/ComfyUI/blob/master/comfy/cli_args.py>
- `execution.py` — <https://github.com/Comfy-Org/ComfyUI/blob/master/execution.py>
- `comfy_execution/caching.py` — <https://github.com/Comfy-Org/ComfyUI/blob/master/comfy_execution/caching.py>
- `comfy_execution/progress.py` — <https://github.com/Comfy-Org/ComfyUI/blob/master/comfy_execution/progress.py>
- `folder_paths.py` — <https://github.com/Comfy-Org/ComfyUI/blob/master/folder_paths.py>
- `nodes.py` — <https://github.com/Comfy-Org/ComfyUI/blob/master/nodes.py>
- `app/user_manager.py` — <https://github.com/Comfy-Org/ComfyUI/blob/master/app/user_manager.py>
- `app/custom_node_manager.py` — <https://github.com/Comfy-Org/ComfyUI/blob/master/app/custom_node_manager.py>
- `comfy_api/latest/_io.py` — <https://github.com/Comfy-Org/ComfyUI/blob/master/comfy_api/latest/_io.py>

**Frontend** — `Comfy-Org/ComfyUI_frontend@main`:
- `src/types/comfy.ts`, `src/types/extensionTypes.ts`, `src/scripts/app.ts`
- `src/platform/workflow/templates/composables/useTemplateUrlLoader.ts`, `…/useTemplateWorkflows.ts`
- `src/platform/workflow/management/stores/workflowStore.ts`
- `src/utils/hostWhitelist.ts`, `src/platform/telemetry/initHostTelemetry.ts`

**Docs** — <https://docs.comfy.org/> (`.md` suffix form):
- `development/comfyui-server/comms_routes`, `…/comms_messages`, `…/startup-flags`
- `custom-nodes/js/javascript_overview`, `…/javascript_sidebar_tabs`
- `custom-nodes/backend/lifecycle`, `custom-nodes/workflow_templates`, `registry/specifications`

**Issue** — #14618 "ComfyUI keeps loading models on every prompt change", <https://github.com/Comfy-Org/ComfyUI/issues/14618> (open, `Potential Bug`); follow-up #15275; fix commit `8084083`.
