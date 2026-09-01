# ComfyUI UX research — what users actually like and dislike about the interface

**Purpose:** inform design improvements for **Prompt Studio** (offline single-file HTML prompt-engineering tool; header with grouped dropdown menus, central intent textarea, model chips, streaming result cards, 8 slide-in side panels, dark/light steel-blue themes). Every Prompt Studio user is also a ComfyUI user, so ComfyUI is the interface they have muscle memory for and the bar they measure against.

**Research window:** ComfyUI frontend v1.16 → v1.4x era, roughly Aug 2024 – Aug 2026. Emphasis on the Comfy-Org frontend rework (new menu → sidebar tabs → floating toolbox → Nodes 2.0 Vue migration).

**All URLs accessed 2026-09-01.**

## Evidence labels used

| Label | Meaning |
|---|---|
| `[OFFICIAL]` | Comfy-Org docs, blog, release notes |
| `[STAFF]` | Named Comfy-Org maintainer/designer statement in an issue or comment |
| `[USER]` | Verbatim user statement with URL |
| `[USER-PARA]` | Paraphrase from a search-engine snippet or aggregator; NOT verbatim |
| `[LORE]` | Widely-repeated community claim without a primary source located |
| `[NOT FOUND]` | Area searched, nothing usable |

**Access caveat:** reddit.com returns 403 to direct fetching. Reddit quotes below were transcribed verbatim from a Redlib mirror (safereddit.com) that serves the original post/comment text; canonical reddit.com URLs are given. GitHub's server-rendered issue HTML omits comment threads, so comment quotes on issues #7107 / #8157 / #10585 / #4661 were read from the live DOM. Where a date could not be pinned exactly it is marked "approx."

---

## 1. What users praise — concretely

### 1.1 The canvas's total visibility is the product

This is the single most consistent piece of praise, and it is *anti*-abstraction. Users do not want the pipeline hidden; the exposure **is** the value.

> "Seeing how everything happens in order and in connection is clarifying, and things like controlnet/openpose make way more sense visually to me."
> `[USER]` r/comfyui, "comfyUI is like crack. Why is everyone so afraid to switch?" — https://reddit.com/r/comfyui/comments/1i1kcpe/ (approx. Jan 2025)

> "Needing to manually pipe the data through from start to finish absolutely helps you gain a better understanding of the component pieces of a Stable Diffusion pipeline. It really helps you understand that it's not, like, one piece of software called 'AI'…"
> `[USER]` u/Peregrine2976 (62 pts), same thread

> "I learnt nothing about what i am doing in the 1 week of using a1111, but a lot in the first days of comfyui."
> `[USER]` u/Only4uArt — https://reddit.com/r/comfyui/comments/1gcialy/ (approx. Oct 2024)

> "I think gradio/automatic1111 makes learning harder than it needs to be by hiding what it's doing behind its UI, while eg- comfyui has a higher initial learning curve but provides a more representational view of process and pipelines."
> `[USER]` washadjeffmad, Hacker News — https://news.ycombinator.com/item?id=36416769 (2023-06-21)

> "100% this. we use ComfyUI to mess with things under the hood, not to hide from them"
> `[USER]` u/Zueuk (15 pts), "Rant on subgraphs in every single template" — https://reddit.com/r/comfyui/comments/1qfnajq/ (approx. Dec 2025)

> "If I hide the links, how will I study the connections and observe what's happening? It's not about making workflow look pretty. I want my workflow to be readable."
> `[USER]` u/Downtown-Bat-5493 — https://reddit.com/r/comfyui/comments/1o7zeo9/ (approx. Oct 2025)

**Design implication:** for this audience, "we simplified it for you" reads as *"we took something away."* Progressive disclosure is fine; progressive disclosure **on by default** is not.

### 1.2 Subgraphs — the one 2025 feature with near-universal praise

Even the harshest critics of the frontend rework single subgraphs out:

> "The one saving grace and amazing feature has been subgraphs."
> `[USER]` @mossmatrix, issue #7188 — https://github.com/Comfy-Org/ComfyUI_frontend/issues/7188 (2025-12-05)

> "You can collapse complex node chains into a single neat package, save them, share them, and even edit them in isolation. It's like macros or functions for ComfyUI—finally! … No more … trying to visually manage a spaghetti mess of nodes."
> `[USER]` OP — https://reddit.com/r/comfyui/comments/1l3xn1m/ (approx. Jun 2025)

> "the fact that it auto updates all instance is a big deal"
> `[USER]` u/moutonrebelle, same thread

> "This is great, my workflows have repeated elements and this can be a huge time saver."
> `[USER]` u/Hearmeman98, same thread

Note the *shape* of this praise: subgraphs are loved as a **user-authored** abstraction (I chose to fold this up), and resented when **imposed** (official templates that ship pre-folded — see §2.6).

### 1.3 A minimalist, get-out-of-your-way, engineering-oriented interface

The clearest articulation of what users think they lost:

> "I always run a single job at a time and they finish so fast I have no use of all those flashy indicators, badges, badge numbers, queues, jobs, and assets strewn out throughout the interface — they are just adding cognitive load to what used to be a **minimalist, get out of your way, engineering oriented, and very functional** interface."
> `[USER]` @levicki, issue #7107 — https://github.com/Comfy-Org/ComfyUI_frontend/issues/7107 (2026-03-17)

> "I'm still using version 1.28.8 of the frontend. It works perfectly for all my workflows, even with the latest version of the backend. There are no visible bugs. **The interface is minimalist and clean, with a large workflow area and nothing unnecessary.** … If you really want to make a user-friendly frontend, then just make sure users can customize the interface and add only the features they need."
> `[USER]` @marchcat69, issue #10585 — https://github.com/Comfy-Org/ComfyUI_frontend/issues/10585 (2026-04-01)

### 1.4 Workflow-in-a-PNG portability

> "I drag and drop PNG with them better work flows all the time, we need this feature."
> `[USER-PARA]` quoted in search snippet; primary thread not recovered

> Described as one of the most useful "how did I ever live without this?" mechanics in the ComfyUI ecosystem — drag the generated PNG back onto the canvas and the whole node graph reappears.
> `[USER-PARA]` Civitai article prose, not a forum quote — https://civitai.com/articles/26592/the-workflow-in-a-png-trick-in-comfyui

`[OFFICIAL]` The mechanic is documented at https://docs.comfy.org/development/api-development/workflow-metadata

**No verbatim enthusiastic user quote was recovered for this feature** — but the *breakage* reports are loud, which is itself evidence of dependence:

> "The bigest bug i have right now with those new frontend, is the drag and drop a png in canvas is broken for png that do have an embed workflow AND extra meta data. It doesn't load if both are there. Why? Why?"
> `[USER]` @Poukpalaova, issue #7219 (2025-12)

### 1.5 Nodes 2.0 — the minority positive case

> "the big win is we can finally use real modern web components inside nodes. With the old canvas, even adding a simple color picker was a nightmare. Nodes 2 opens the door to proper in-node UI: real sliders, color pickers, dynamic inputs…"
> `[STAFF]` u/crystal_alpine (28 pts) — https://reddit.com/r/comfyui/comments/1peeqrj/ (2025-12-04)

> "After a few hours of Nodes 2.0 I kind of like them. … Fast clicking response is always noticeable… Comfy's UI is very well thought and developed, thousands of human hours are into it and the product is amazing."
> `[USER]` gershu, blog comment — https://blog.comfy.org/p/comfyui-node-2-0 (2026-07-23)

> "It's already much better than it was two weeks ago. The nodes don't jump around anymore, and the interface is actually very nice. … once they get rid of the teething problems, it will definitely be a step forward. UX-wise at least."
> `[USER]` — https://reddit.com/r/comfyui/comments/1pre00a/ (approx. Dec 2025)

> "One nice thing about Nodes 2.0 is that most components are HTML. Which means I can use custom CSS, with something like Stylus, to do things like mitigate the size increase."
> `[USER]` u/Ken-g6 — https://reddit.com/r/comfyui/comments/1vi2v3s/ (approx. Aug 2026)

### 1.6 Small canvas affordances users name by hand

> "You're not even mentioning the coolest part. Right clicking a lora will allow you to show info and open up a dialog that shows the civitai info for the lora. AND THIS DOESN'T HAPPEN IN NODES2.0. This alone makes nodes 2.0 worse."
> `[USER]` u/bronkula — https://reddit.com/r/comfyui/comments/1tkqq36/ (approx. 2026)

> "Better search function in dropdown menus, just like litegraph, that's the best."
> `[USER]` Sofocletus — https://github.com/Comfy-Org/ComfyUI_frontend/discussions/12330 (2026-06-03)

> "The newer method is to just Alt + Click anywhere on a wire to create a round re-route node."
> `[USER]` u/kplh (approx. Oct 2025)

> "The ability to do A/B testing by quickly arrowing through the queue was super useful."
> `[USER]` @NouberNou, in issue #7195 comment set

### 1.7 Release-day enthusiasm for 0.3.51 (subgraph + Manager UI + minimap)

> "Awesome. The tool is really starting to show some maturity now." — u/wh33t
> "You're amazing guys! :D This is slick af!" — u/ReasonablePossum_
> "I'm so impressed with the push we've seen on comfyui ❤️" — u/FreezaSama
> "**I like the new brand colors, the neon blue from earlier was bold but a little distracting.**" — u/TekaiGuy
> `[USER]` — https://reddit.com/r/comfyui/comments/1mwtq9w/ (approx. Aug 2025)

That last one is directly relevant to Prompt Studio's palette question — see §4.

### 1.8 ComfyUI Manager as the default safety net

> "Wait, there are people out here raw-dogging ComfyUI custom nodes without ComfyUI manager…? That's definitely a recipe for a bad time."
> `[USER]` u/remghoost7 — https://reddit.com/r/StableDiffusion/comments/1hj0edi/ (approx. Dec 2024)

---

## 2. What users complain about

The complaint corpus is much larger and much more specific than the praise corpus. Sorted by frequency and heat.

### 2.1 Floating chrome that overlays the canvas — the #1 structural complaint

This is the most reacted-to theme in the frontend repo. Top-reacted `area:ui` issues (via GitHub search API, sorted by reactions):

| # | Title | Opened | State |
|---|---|---|---|
| 7219 | I appreciate you all, but PLEASE STOP FIXING WHAT ISN'T BROKEN | 2025-12-07 | closed |
| 7195 | Please give us back the old UI. | 2025-12-05 | open |
| 7107 | Screw job history | 2025-12-02 | open |
| 7772 | Very Poorly Planned UI Updates | 2025-12-27 | open |
| 6104 | Feedback on the floating menus | 2025-10-17 | open |
| 7188 | A plea: share designs for feedback with the community before implementation | 2025-12-05 | closed |
| 6484 | [Vue nodes] Add a compact version of the new nodes | 2025-10-31 | open |
| 7184 | Suggestions for feedback on Node2's new interface and other UI issues | 2025-12-05 | open |
| 10831 | Nodes 2.0: Performance and usability issues caused by replacing canvas-based node rendering with DOM elements | 2026-04-02 | open |
| 4342 | [Feature Request] Realtime interactive viewport | 2025-07-03 | open |

Quotes:

> "I don't want these widgets or whatever you call them 'floating' over the canvas like that. They get in the way of seeing my nodes. Especially with how I use ComfyUI in a vertical layout, where ComfUI uses one half of my screen while the other half is used for multitasking. … Why was this change made? And why was the ability to press F to go fullscreen canvas mode taken away? **ComfyUI isn't so comfy anymore after v0.3.70.**"
> `[USER]` @Uzukii, issue #7195 — https://github.com/Comfy-Org/ComfyUI_frontend/issues/7195 (2025-12-05)

> "I also agree here - having the toolbar floating wastes space and gets in the way. It should integrate into the top bar or have an option to do so."
> `[USER]` @11-Lambda, same issue

> "ComfyUI is an app that already deals with nodes represented as boxes that you move around and connect. **If the menu becomes floating and/or disconnected like this, it creates more boxes, and now you need to pay some additional attention to discriminate if the box you're looking at is part of the menu or a node.** Sure, it's pretty, but it makes the experience more confusing for me."
> `[USER]` @dchatel, issue #6104 — https://github.com/Comfy-Org/ComfyUI_frontend/issues/6104 (2025-10-17)

> "The entire bar with the new unrecognizable icon for the Manager, along with other tools like CPU, RAM, GPU stats, K-monitor and Run button now appears ON TOP OF MY WORKFLOW. This makes it even more difficult to see the workflow. This 'toolbar' should exist above the canvas, not in it!"
> `[USER]` @Moorer624, issue #7772 (2025-12-27)

> "My preferred number of UI elements that overlay the canvas viewport is **zero** or entirely user configurable toolbars which can optionally be undocked and floated."
> `[USER]` @without-ordinary, issue #7107 (2025-12-07)

> "Every single element that now hovers over the canvas is extremely annoying. I've made a user.css to push, shrink and connect them to the corners. This makes the new UX mildly more tolerable, but overall the corners and top of the canvas viewport are still unusable."
> `[USER]` @without-ordinary, issue #7107 (2026-01-06)

> "About 4 months later and the first thing I do every frontend load is use the browser's inspect tool to manually delete the html nodes for the various parts of the intrusive queue UI."
> `[USER]` @without-ordinary, issue #7107 (2026-04-06)

> "This floating label bar does not fully utilize the top space and may also cause the canvas area to be obscured. I still prefer the previous version, where I could at least choose to place the label bar at the top, side, or second column"
> `[USER]` @3qyemo, issue #7184 (2025-12-05)

> "workflows tab is now always on a separate second row, which clutters the space on screen and reduces the amount of visible information"
> `[USER]` @MaggotHATE, issue #5095 — https://github.com/Comfy-Org/ComfyUI_frontend/issues/5095 (2025-08-19)

### 2.2 Hover-revealed and hidden controls — especially destructive ones

The strongest, most quotable UX rule in the whole corpus:

> "The queue just disappeared. Finally found the new spot but it's hidden unless you put your mouse over a magic spot. That's **UNIVERSAL UI DESIGN MISTAKE NUMBER ONE!!! Never hide UI controls.**"
> `[USER]` tjdennis — https://github.com/Comfy-Org/ComfyUI/discussions/11074 (2025-12-05)

> "Yesterday I was generating a video and it was almost finished. I moved my mouse to the top-right to click something on the canvas and the queue emerged causing me to **NARROWLY miss the 'cancel job' button.**"
> `[USER]` @Tekaiguy, issue #8157 — https://github.com/Comfy-Org/ComfyUI_frontend/issues/8157 (2026-01-19)

> "A panel that suddenly appears on hover with **not one but two destructive actions**, is not just annoying, it's objectively dangerous UX."
> `[USER]` @andreszs, same issue (2026-01-19)

> "Why do we have to hover the progress bar to cancel jobs now? I greatly preferred having the clear queue / cancel buttons unhidden."
> `[USER]` u/Haiku-575 — https://reddit.com/r/comfyui/comments/1peeqrj/ (2025-12-04)

> "The cancel button should always be visible. The change from Grey to Red of the cancel button is also a great visual queue that something is in progress."
> `[USER]` @signalstop, issue #7107 (2025-12-05)

`[STAFF]` Kaili Yang (Comfy-Org contributor), issue #8157, 2026-01-23:
> "As an experienced Web SDE, I believe any 'Cancel' or 'Delete' action should trigger a secondary confirmation."

`[STAFF]` christian-byrne closed #8157 on 2026-02-02 with: *"We moved it back to the left panel, you can find the setting by searching 'Queue' in the settings."* — i.e. **Comfy-Org conceded this one.**

### 2.3 Information density — nodes got bigger and show less

This is the single most *measurable* complaint, and the most directly transferable to Prompt Studio.

> "The new Vue nodes look good, but they are very large. This makes it difficult to create and navigate large workflows… We can reduce the zoom level, but this does not solve the problem because: The nodes are still much wider than the old design… The font it's harder to read at lower zoom levels."
> Proposed fix, verbatim: "**Widget name inside the widget area / Smaller minimum width**" plus an "ultra compact" version with "**Shorter header / No space between widgets**".
> `[USER]` @JorgeR81, issue #6484 — https://github.com/Comfy-Org/ComfyUI_frontend/issues/6484 (2025-10-31). Self-reported frequency: "Daily".

> "Nodes 2.0 are bigger and at the same time display far less information than legacy nodes… To display the full name the Node 2.0 needs to be nearly *twice* the size (in area)… **Node 2.0 shows 7 LoRAs, legacy node shows 42, meaning you have to scroll six times longer to find things.**"
> `[USER]` Sofocletus — https://github.com/Comfy-Org/ComfyUI_frontend/discussions/12330 (2026-05-19)

> "the new nodes take up twice the space of the 'legacy' nodes for the same functionality; which means it will break the layout of a workflow shared between people who use different node types."
> `[USER]` Sofocletus — https://github.com/Comfy-Org/ComfyUI/discussions/11074 (2025-12-03)

> "Aside from performance, I want Nodes 2.0 to be more compact. The nodes are bigger compared to litegraph with less space for the same amount of information."
> `[USER]` u/TekaiGuy (approx. 2026)

> "Seems the new nodes require a larger minimum size and won't scale down. This means each node now takes up more UI real estate. Not an improvement in my book."
> `[USER]` carsonjones — https://forum.comfy.org/t/how-to-revert-to-previous-nodes-new-node-design-issues/3980 (2025-11-30)

> "Also the font and node size for the legacy nodes has been changed, so every single workflow I carefully created is now a blob of overlapping nodes. **The option to manually set font sizes in the ComfyUI\user\default\comfy.settings.json has been removed** so there's no easy fix to this."
> `[USER]` @Sofocletus, issue #10585 (2026-05-19)

> "IMO any empty space is an opportunity cost. The left-side bar remains empty to this day… Any space like that represents lost screen real-estate for as long as it can't be used, times the number of users (equaling an absolutely massive cost to human productivity)."
> `[USER]` @Tekaiguy, issue #7107 (2026-01-08)

**This audience is a high-density audience.** They will trade whitespace for rows-on-screen every time.

### 2.4 Contrast, legibility, motion sensitivity, accessibility

> "My biggest issue with nodes 2.0 is the overall **way too low contrast** in the new nodes. Light grey text on dark grey background combined with almost invisible data field separation from the background… For older users like me, or users with reduced eyesight, this new UI is a nightmare."
> `[USER]` u/JustLookingForNothin (15 pts) — https://reddit.com/r/comfyui/comments/1peeqrj/ (2025-12-04)

> "There are a lot of nearly identical dark themes and **one light theme that's too bright. What would be nicer would be a light grey or medium grey theme**… the only theme that has easily readable fonts is the light theme but it's too bright. I tried to find a setting in ComfyUI to change the font but couldn't."
> `[USER]` SRStwo — https://github.com/Comfy-Org/ComfyUI/issues/13590 (2026-04-27)

> "blinking stuff in my peripheral vision seriously triggers my OCD. And yes, it's pretty much blinking on RTX 5090 — progress and the option to cancel it just flashes and disappears so it's totally, utterly pointless."
> `[USER]` @levicki, issue #7107 (2025-12-02)

> "When designing UI, you need to think about people who: Have impaired vision … Have peripheral vision sensitive to motion (this is what triggered me so much) / Have higher sensitivity to flickering elements"
> `[USER]` @levicki, issue #7107 (2025-12-04)

> "A friend spent the entire long weekend writing up summaries for the majority of the issues on Discord, much to the detriment of his health since a number of the issues affect his **photosensitivity** problems."
> `[USER]` u/KadahCoba (24 pts) (2025-12-04)

> "These changes spit in the face of accessibility and make the experience worse."
> `[USER]` @mossmatrix, issue #7188 (2025-12-05)

> "I personally believe they tried to simplify the look… I believe they simplified it way too much. **Makes it harder to use because things are smooth they blend together.**"
> `[USER]` u/The_Last_Precursor — https://reddit.com/r/comfyui/comments/1r05zu9/ (approx. Jan 2026)

> "why change the style of the elements to some unreadable Star trek fanboy shit?"
> `[USER]` u/HumungreousNobolatis, same thread

> "It's a matter of taste, but I really dislike this baby-toy-like design. And these nodes looks like less compact and space efficient."
> `[USER]` Vinz, blog comment — https://blog.comfy.org/p/comfyui-node-2-0 (2025-12-05)

**Pattern:** this audience reads *soft, low-contrast, rounded, airy* as **amateur and unreadable**, not as modern. Hard edges, visible field boundaries and high text contrast read as *professional tool*.

### 2.5 UI churn and change-control — the meta-complaint

> "Constantly moving buttons and introducing disparate paradigms is incredibly confusing and does not offer value. … We have seen some insane changes to the UI such that it feels like whoever is making these suggestions and changes doesn't actually use Comfy at all. Or it similarly feels like 5 competing interns making it up as they go along."
> `[USER]` @mossmatrix, issue #7188 (2025-12-05)

> "Many of the new UI changes are genuine downgrades - the need to click the zoom button in the image panel, rather than just click the image itself to zoom, the missing X on the run button… and the list goes on."
> `[USER]` @Ainaemaet, issue #7219 (2025-12-06)

> "I spend 9/10th of my day fixing problems that result from 'upgrades'. My productivity has been severely hampered by the latest changes. **The change-control process is out of control** (and that's the sort of thing I do for a living, so take what I'm saying seriously)."
> `[USER]` @Moorer624, issue #7772 (2025-12-27)

> "comfy ui designer: you know what, those lazy mf need to click more! click clakity clack, with every update more clicks"
> `[USER]` u/Luntrixx — https://reddit.com/r/comfyui/comments/1rszk3y/ (approx. Feb 2026)

> "I think we are getting to a point where if this keeps happening we will start to see more stable forks of the UI get preferred by users."
> `[USER]` @mossmatrix, issue #7188

> "GREAT UI/UX WILL FOSTER EMERGENCE IN HABITS AND WORKFLOWS, AND **AVOID BREAKING MUSCLE MEMORY AT ALMOST ANY COST!**" (original capitalisation)
> `[USER]` rustcleaner, Hacker News — https://news.ycombinator.com/item?id=46269308 (2025-12-15)

`[STAFF]` christian-byrne, issue #10585, 2026-03-27 — Comfy-Org's own post-mortem, worth quoting in full because it validates every complaint above:
> "Over the past month, a number of releases shipped with regressions that shouldn't have made it out. … We let velocity outrun stability, and that's on us. … ComfyUI is infrastructure for a lot of people's workflows, experiments, and in some cases livelihoods. Regressions aren't just annoying -- they break things people depend on. **We want ComfyUI to be something you can rely on. It hasn't been.** … We've paused new feature work until at least the end of April."

`[STAFF]` comfydesigner, issue #7107, 2026-01-05 — the concession that matters most for design guidance:
> "We're removing the progress overlays and moving the floating queue panel back into the left media assets tab. We're preserving list view in addition to bringing back grid view with sampling previews. Jobs will disappear once they're finished and replaced with the respective final output(s), like before. **These changes will be opt-in, and in the future larger UI changes like this will be behind a toggle**, similar to Nodes 2.0 so that they're less interrupting."

`[USER]` LTS proposal that got traction (@serious-44, #10585, 2026-03-30):
> "it would be sufficient if you put together a stable LTS version where you only make bug fixes. And when you add new features, release a version for beta testing. If you call it an experimental release for people who want to try out new features, no one can complain about the bugs."

### 2.6 Queue / history mental model

This is the richest vein for a companion app, because ComfyUI got it *wrong* twice and users described exactly what "right" is.

> "I have never had a good time trying to use the job history. When using controlnet auxiliary preprocessors, the depth map will show in the history instead of the final image most of the time. Sometimes the final image shows when you click on the output batch, sometimes it's completely lost. **So far this feature has been so inconsistent and unreliable that I usually don't even bother trying.** … I think every output should have it's own preview."
> `[USER]` @Tekaiguy, issue #7107 (2026-01-02)

> "the removal of the 'queue' is just plain bad. The assets view does not show the preview images, only the finished image. I am ok with the removal of the queue, but then they need to add the preview to it."
> `[USER]` @Jamerrone, in #7195 comment set

> "Also in the very latest update they removed the 'queue' sidebar as well. God I miss the queue sidebar when I press Q."
> `[USER]` @TheNightmare4865, in #7195 comment set

> "before, when I hit Run, I could see the workflow progressing from node to node, now I don't see anything. … the X to cancel jobs is gone, and I don't get image previews in the workflow anymore, I have to open them manually from the output folder."
> `[USER]` u/Eydahn — https://reddit.com/r/comfyui/comments/1pi5mqx/ (approx. Dec 2025)

> "It is totally unacceptable bundling of unrelated stuff together — controls (number of images in batch, run, cancel) and a stupid status indicator [0 active] which moonlights as a button which opens totally unrelated UI drawer in a totally different part of screen."
> `[USER]` @levicki, issue #7107 (2026-03-16)

The complete requirements list one user wrote (issue #7107, @levicki, 2025-12-03) is effectively a spec:
> "Put the damn button in the sidebar. / Place it at the bottom so existing button order isn't disrupted. / Make the job history panel movable like the Run panel. / **Ensure elements inside don't jump around and the panel doesn't resize on its own.** / Put job progress bars inside the panel on an opaque background. / **Persist its state — position, size, visibility.**"

Placement argument worth noting (right-side panels block a left-to-right flow):
> "Most humans follow a left to right writing script… So it's a normal tendency to also make workflows which start from left and develop further towards the right. Queue panel on the right does block the view. There's a reason why 'vertical tabs' feature on browsers is on the left."
> `[USER]` u/lolxdmainkaisemaanlu, issue #8157 (2026-01-21)

Dissent exists — one user defended right-side placement:
> "I disagree with this change, it will cover up more on the left than being on the right. The que is also close to run button which is nice and make logical sense."
> `[USER]` @noyart, issue #8157 (2026-01-19)

### 2.7 Imposed abstraction: subgraphs in official templates

> "I'm annoyed as hell from wasting my time on having to unpack and rearrange the nodes every single time I open a workflow… **No, I don't want less controls. No, I don't want your streamlined user experience.**"
> `[USER]` OP — https://reddit.com/r/comfyui/comments/1qfnajq/ (approx. Dec 2025)

> "I want to see what the nodes in the template do and understand how the workflow works. I can't do that if there is just a single big subgraph node."
> `[USER]` u/Euchale, same thread

> "Subgraphs have no place in workflows meant to teach and demonstrate."
> `[USER]` u/Sarashana, same thread

> "I just love how they put the seed value as an input for the subgraph and the setting to make it fixed/random/increment/etc, but if you do that **the seed can't actually change** because the subgraph expects you to give it a value." (54 pts, top comment)
> `[USER]` u/OnceWasPerfect, same thread

Corroborated by `[OFFICIAL]` issue #14102 "Cannot display control_after_generate in subgraphs" — https://github.com/Comfy-Org/ComfyUI_frontend/issues/14102 (2026-07-25).

### 2.8 Vocabulary sprawl

> "That's a third word for workflow/graph. And 'Subgraph Blueprints' — so now a subgraph is also a blueprint, which is different from a graph, which is also a workflow. … 'Bookmarked' with 'No favorites yet' — so bookmarks are also favorites now. **Four words: workflow, graph, blueprint, and the bookmark button that was actually an overview panel.**"
> `[USER]` @levicki, issue #7107 (2026-03-16)

> "you have too many different terms describing the same thing. Workflow is the original term, graph is the same as workflow, group is the original term, app and subgraph are the same as group. It is confusing and unnecessary."
> `[USER]` @levicki, same

`[STAFF]` comfydesigner conceded the icon half of it: *"Admittedly, lucide's (the icon library we're using) puzzle icon did look like a barbell. We've since updated this to 'Extensions'."*

### 2.9 Mobile and touch

> "It's from frustration in trying to focus on building gen AI workflows and not worrying about which button will disappear next or **which new overlay will block half my screen on mobile.**"
> `[USER]` @mossmatrix, issue #7188 (2025-12-05)

> "This atrocity just wastes space and **on mobile in particular makes the experience awful.**"
> `[USER]` @mossmatrix, issue #7107 (2025-12-03)

> "ComfyUI is just so, so difficult to use on a normal size screen with a trackpad. It's designed for someone with a 34" gamer monitor and a mouse with like six buttons, and I haven't seen a good working node based interface that would be comfortable on a Mac or iPad… On the love side, everting the workflow into the main thing is really interesting…"
> `[USER]` vessenes, Hacker News — https://news.ycombinator.com/item?id=48246474 (2026-05-23)

> "even if they sort out all the problems I listed the **large, thumb sized UI is meant for use on tablets and phones.** This, to me, signals the beggining of ComfyUI focusing on being an API frontend rather than a tool for local generation."
> `[USER]` Sofocletus — https://github.com/Comfy-Org/ComfyUI/discussions/11074 (2025-12-06)

`[USER-PARA]` Pinch gestures on mobile zoom the whole browser page rather than the canvas; the community answer is third-party injection packs (ComfyUI-MobileFriendly, ComfyUI-Touch-Gestures, ComfyUI_CozyGen, comfyui-mobile-frontend). — https://github.com/XelaNull/ComfyUI-MobileFriendly

**Key insight for Prompt Studio:** touch-sized targets are read by this audience as a *symptom of cloud/API ambitions*, not as generosity. Desktop-density-first with an explicit density toggle is the safe posture.

### 2.10 Performance of DOM-based UI

> "The ongoing shift in Nodes 2.0 toward rendering node graphics as individual DOM elements introduces significant performance and interaction problems… fps drops from 60+ down to below 5 regularly… **I simply do not use Nodes 2.0 as it is not even feasible.**"
> `[USER]` @silveroxides, issue #10831 — https://github.com/Comfy-Org/ComfyUI_frontend/issues/10831 (2026-04-02)

> "I tested with a 200+ node workflow and my fans started spinning faster and the UI was dropping frames (RTX 5090). It's not a specs issue"
> `[USER]` u/TekaiGuy

> "The 2.0 UI is incredibly unoptimized and extremely heavy compared to the old nodes… that is 80% of problems people have with nodes 2.0."
> `[USER]` u/iRainbowsaur

Relevant to Prompt Studio because it is a single-file HTML app with streaming result cards: **this audience notices frame drops and blames the UI framework.** Keep DOM churn per streamed token low; virtualise long lists.

### 2.11 Learning cliff (context, not directly actionable)

> "I'm at the stage where I still don't want to use it because it's such an unapologetic bastard." — u/H0vis
> "I knew outright when i first saw comfy, there was nothing comfy about it." — u/thisguy883
> "I've worked in IT for 30 years and think Comfy is crap. There's no reason it's that complicated. It's just poorly designed." — u/pcloadreddit
> `[USER]` — https://reddit.com/r/StableDiffusion/comments/1hj0edi/ "Comfyui is abusive." (approx. Dec 2024)

> "I've been using A1111 for 1,5 years and decided to cross over to Comfy for Flux. 2 months later still struggling. The simplest things that are built into A1111's interface are an absolute nightmare to achieve in CUI."
> `[USER]` u/Sir_McDouche (approx. Oct 2024)

> "I spend half my time on Comfy clicking and dragging every node around the screen to see what its links are connected to."
> `[USER]` u/whitstableboy (approx. Oct 2025)

> "ComfyUI-inspired node graphs are the wrong approach for visual media. Nodes are great for the 1% of artists that get into it… We want to mold ideas like clay. … Not a mathematical abacus."
> `[USER]` echelon, Hacker News — https://news.ycombinator.com/item?id=45948285 (2025-11-16)

> "those who want local models *should* be exposed to the settings/complexity that projects like oobabooga/sillytavern/comfyUI force a user to educate themselves about… It's telling that the best AI generated content is made by people using these prosumer style projects."
> `[USER]` Der_Einzige, Hacker News — https://news.ycombinator.com/item?id=45800413 (2025-11-03)

### 2.12 Telemetry / trust

> "the fact you also removed the ability to easily check to not send telemetry data has me not wanting to send you guys anything at all… as I feel I can't trust anyone who doesn't give people the *choice* ('We promise' isn't enough)."
> `[USER]` @Ainaemaet, issue #7219 (2025-12-06)

This is a **positioning asset** for Prompt Studio: an offline single-file HTML tool with zero network calls is exactly the property this audience is anxious about losing.

---

## 3. Muscle memory — conventions to mirror

`[OFFICIAL]` Canonical shortcut table — https://docs.comfy.org/interface/shortcuts

| Binding | Meaning in ComfyUI | Transferable to Prompt Studio? |
|---|---|---|
| **Ctrl+Enter** | Queue prompt (generate) | **Yes — mandatory.** Already bound on `#intent`; should be global. |
| **Ctrl+Shift+Enter** | Queue prompt **(front)** — jump the queue | Yes — map to "regenerate now / push to top of results". |
| **Ctrl+Alt+Enter** | Interrupt | Yes — map to stop/cancel streaming. |
| **Ctrl+,** | Settings dialog | **Yes — mandatory.** Universal in this audience. |
| **Ctrl+S / Ctrl+O** | Save / load workflow | Yes — save/load prompt set as JSON. |
| **Ctrl+Z / Ctrl+Y** | Undo / redo | Yes for the intent textarea and chip state. |
| **Ctrl+B** | Bypass selected nodes (skip but pass data through) | Concept transfer: "disable this block but keep the rest" toggles. |
| **Ctrl+M** | Mute selected nodes (stop execution entirely) | Distinct from bypass; keep the distinction if you model it. |
| **Ctrl+G** | Group selected | Optional. |
| **Bare `Q`** | Toggle **Queue** sidebar | Bare-letter sidebar toggles are the strongest single convention. |
| **Bare `W`** | Toggle **Workflows** sidebar | |
| **Bare `N`** | Toggle **Node library** sidebar | |
| **Bare `M`** | Toggle **Model library** sidebar | |
| **Bare `F`** | Focus mode / fullscreen canvas | Yes — hide all chrome, maximise the work area. Its removal caused issue #7195. |
| **Bare `R`** | Refresh node definitions (rescan models) | Yes — "re-read knowledge bank / reload data". |
| **Bare `P`** | Pin / unpin | Yes — pin a result card. |
| **Bare `.`** | Fit view to selection | Contextual. |
| **Ctrl+`** | Toggle bottom log panel | Yes — a console/debug drawer. |
| **Alt+C** | Collapse / uncollapse | Yes — collapse a result card or a panel section. |
| **Ctrl+A** | Select all | |
| **Double-click empty space** | Quick node search | **Yes** — double-click on empty background = command palette / quick-add. |
| **Right-click** | Context menu (on node, on canvas, on a LoRA widget) | **Yes** — this audience right-clicks *everything* and is annoyed when nothing happens. |
| **Drag link → release on empty canvas** | Type-filtered node suggestion menu | Concept transfer: drag a chip out and drop it to get contextual options. |
| **Alt+Click on a wire** | Insert reroute | |
| **Drag file onto canvas** | Load workflow from PNG/JSON | **Yes — mandatory.** |
| **Shift+Click / Ctrl+Click** | Add to selection | |
| **Space + drag** | Pan | |
| **Click-and-drag on a numeric widget** | Scrub the value | **Yes** — its loss in Nodes 2.0 is actively mourned. |

Named losses (each is an opportunity to be the app that kept it):

> "I really miss the ability to click and drag (scrub) to change values for things like Seed, Denoise, and CFG. It seems we are forced to type them in manually now. The old 'slider' feel was much faster for tweaking workflow. … It would be a massive QoL improvement if there was a clear visual distinction between official nodes and custom nodes, especially in the 'Add Node' menu/search."
> `[USER]` u/Bitter-Solution1867 (2025-12-04)

> "Legacy node: start typing LoRA name, after it's found hit enter and done. Node 2.0: … it's necessary to use the down key to select it and then press Enter. **This makes a two step (type>Enter) into a three step process.**"
> `[USER]` Sofocletus (2026-05-19)

> "I don't know what they were thinking when in the initial release of Nodes 2.0 they omitted the search, but it makes me think that the developers don't really use ComfyUI. **It's as if a designer decided to optimize a car design by removing one wheel.**"
> `[USER]` Sofocletus (2025-12-08)

**Seed + `control_after_generate` adjacency** `[OFFICIAL]`: in ComfyUI the seed widget is immediately followed by a control-mode selector (fixed / increment / decrement / randomize). This adjacency is deeply learned; users noticed instantly when subgraphs broke it (§2.7). If Prompt Studio surfaces a seed anywhere, put the control-mode selector directly beneath it, never elsewhere.

**Colored type-coded connections** `[OFFICIAL]` — the exact palette is documented and memorised by heavy users:
`MODEL #B39DDB` (lavender) · `CLIP #FFD500` (yellow) · `CONDITIONING #FFA931` (orange) · `LATENT #FF9CF9` (pink) · `IMAGE #64B5F6` (blue) · `VAE #FF6E6E` (red) · `MASK #81C784` (green) · `CONTROL_NET #6EE7B7` (mint) · `SAMPLER #ECB4B4` · `SIGMAS #CDFFCD` · `NOISE #B0B0B0`
— https://docs.comfy.org/interface/appearance

Prompt Studio's model chips could borrow this **semantic hue grammar** (image = blue, video/latent = pink, text/conditioning = orange, model = lavender) for instant recognition. Cheap, high-payoff.

---

## 4. The new Comfy-Org design language, and how far Prompt Studio sits from it

### 4.1 What Comfy-Org's palette actually is

`[OFFICIAL]` from https://docs.comfy.org/interface/appearance — the "Dark (Default)" theme:

| Token | Value | Note |
|---|---|---|
| `comfy_base.bg-color` | `#202020` | app background |
| `litegraph_base.CLEAR_BACKGROUND_COLOR` | `#222` | canvas |
| `comfy-menu-bg` | `#353535` | menus / panels |
| `comfy-menu-secondary-bg` | `#303030` | |
| `comfy-input-bg` | `#222` | inputs |
| `border-color` | `#4e4e4e` | |
| `fg-color` / `input-text` | `#fff` / `#ddd` | |
| `descrip-text` | `#999` | secondary text |
| `NODE_DEFAULT_BGCOLOR` | `#353535` | |
| `NODE_TEXT_COLOR` | `#AAA` | |
| `NODE_TEXT_SIZE` | `14` | |
| `NODE_SUBTEXT_SIZE` | `12` | |
| `error-text` | `#ff4444` | |

It is a **pure neutral grey ramp** — zero hue. No blue tint, no warm tint. Accent colour lives almost entirely in the type-coded connection slots, not in the chrome.

`[OFFICIAL]` Appearance settings that ship as first-class user controls, which tells you what this audience expects to be able to tune:
- **Color Palette** (switch / export as JSON / import custom / delete)
- **Node Opacity**
- **Textarea Widget Font Size** (range 8–24)
- **Sidebar: Unified Sidebar Width** (on/off)
- **Sidebar Size** (normal / small)
- **Sidebar Location** (left / right)
- **Sidebar Style** (**Connected** / **Floating**)
- **Tree Explorer Item Padding**
- `user.css` escape hatch in the user directory

That list is a direct blueprint. Note especially **Sidebar Style: Connected vs Floating** — Comfy-Org shipped this toggle *because* of issues #6104/#7195/#7772. And note that the ability to tune **font size** and **item padding** is treated as a shipped feature, not an accessibility afterthought.

### 4.2 Nodes 2.0 design language

`[OFFICIAL]` https://docs.comfy.org/interface/nodes-2 and https://blog.comfy.org/p/comfyui-node-2-0 (2025-12-05):
- LiteGraph.js Canvas rendering → **Vue-based DOM** node rendering
- Motivation stated as developer velocity: *"Even small UI changes often required deep modifications and could take days to implement."*
- Stated gains: "Dynamic widgets, expandable nodes, and better components"
- Commitment: *"Legacy Canvas Isn't Going Anywhere… you can switch back in the settings. We're not removing it. No forced migration."*
- Acknowledged debt list in the same post: restore Stop/Cancel and Clear Queue buttons, fix Seed controls, **bring search back to dropdown menus**, optimise performance
- Icon library: **lucide** `[STAFF]` comfydesigner, issue #7107, 2026-03-16
- Frontend stack: Vue + TypeScript, with a stated long-term ambition (`[STAFF]` christian-byrne, issue #4661) of a CRDT state layer and eventually *"Custom rendering engine and graph operations in Rust + WASM"*. Note the community reaction on that RFC: **3 👍 vs 6 👎 and 2 😕.**

**Verdict on the visual language:** it was largely rejected. The rejection is not about hue — it is about **size, contrast, softness and density** (§2.3, §2.4). One user liked the colours specifically: *"I like the new brand colors, the neon blue from earlier was bold but a little distracting."*

### 4.3 Prompt Studio's palette vs the ComfyUI baseline

From `C:\VidGenPrompter\PromptStudio.html` lines 9–16:

| Prompt Studio (dark) | Value | Nearest ComfyUI token | Delta |
|---|---|---|---|
| `--bg` | `#14161a` | `bg-color #202020` | Darker, slightly cooler |
| `--panel` | `#1b1e24` | `comfy-menu-bg #353535` | **Considerably darker** |
| `--panel2` | `#232730` | `comfy-menu-secondary-bg #303030` | Similar value, blue-shifted |
| `--border` | `#2f3540` | `border-color #4e4e4e` | Dimmer border |
| `--text` | `#e7eaee` | `input-text #ddd` | Slightly brighter |
| `--dim` | `#99a2af` | `descrip-text #999` | Same lightness, blue-shifted |
| `--accent` | `#7fa3c7` (steel blue) | *(no chrome accent in ComfyUI)* | Prompt Studio has an accent hue; ComfyUI does not |
| `--err` | `#d98484` | `error-text #ff4444` | Muted |

Prompt Studio (light): `--bg #f2f2f3`, `--panel #ffffff`, `--text #1d1f20`, `--accent #48708f`.

**Assessment — this is close, and closer where it counts:**

1. **Structurally identical**: dark neutral-ish ramp, dim secondary text, subtle borders, near-monochrome chrome with colour reserved for meaning. A ComfyUI user will feel at home immediately.
2. **The blue tint is a small delta.** `#1b1e24` vs `#353535` is a ~3-4° hue shift plus a large lightness drop. It reads as "a darker ComfyUI theme", not as a foreign app. Community themes on Civitai and the Figma "ComfyUI Color Palettes" file cover this range routinely.
3. **Prompt Studio's contrast is materially better than what users are complaining about.** `--dim #99a2af` on `--panel #1b1e24` is roughly 7:1; ComfyUI's `#999` on `#353535` is roughly 4.2:1 and Nodes 2.0's grey-on-grey is worse still — which is precisely the "way too low contrast … a nightmare" complaint (§2.4). **Do not lower it.** Whatever else changes, protect the `--text`/`--dim` contrast ratios.
4. **The light theme is already the thing users asked for and could not get.** SRStwo wanted "a light grey or medium grey theme" because ComfyUI's single light theme is "too bright". `--bg #f2f2f3` with `--panel #ffffff` is exactly that — light grey field, white cards. Worth keeping and worth mentioning in any release notes.
5. **The one real gap: no accent hue exists in ComfyUI's chrome.** Steel blue `#7fa3c7` is a Prompt Studio invention. That is fine — it is muted, professional, and TekaiGuy's comment shows this audience penalises *loud* accents ("neon blue … a little distracting"), not accents per se. `#7fa3c7` is well below that threshold.
6. **Where Prompt Studio risks drifting from the audience is not colour — it is density, motion and hidden controls.** Those are the axes on which Comfy-Org lost the community. See §5.

---

## 5. Ranked design improvements for Prompt Studio

Ranked by (evidence strength × impact on this specific audience) ÷ effort.

---

### 1. Never hide a primary or destructive control behind hover — and never let one appear under the cursor
**Effort: small (CSS + a couple of handlers)**
**Evidence:** §2.2 — the single most-cited UX failure. *"UNIVERSAL UI DESIGN MISTAKE NUMBER ONE!!! Never hide UI controls"* (tjdennis); *"NARROWLY miss the 'cancel job' button"* (Tekaiguy, #8157); *"not one but two destructive actions … objectively dangerous UX"* (andreszs); *"The cancel button should always be visible"* (signalstop). Comfy-Org capitulated and moved the panel back (`[STAFF]` christian-byrne, #8157, 2026-02-02).

**Do:** Generate and Stop are permanently rendered, in a fixed position, never hover-revealed and never overlapping the intent textarea or result cards. Stop is grey when idle, red when streaming (signalstop's explicit ask). Nothing appears under the pointer on hover in the header region. Destructive actions in slide-in panels (clear history, delete preset) get a confirm step (`[STAFF]` kaili-yang's ask).

---

### 2. Full ComfyUI keyboard parity, plus a discoverable shortcuts sheet
**Effort: moderate**
**Evidence:** §3, `[OFFICIAL]` docs.comfy.org/interface/shortcuts. Currently only `Ctrl+Enter` (bound to `#intent` only, line 1056) and `Escape` (line 1967) exist.

**Do:** globalise `Ctrl+Enter` (generate) regardless of focus; add `Ctrl+Shift+Enter` (regenerate / push to front), `Ctrl+Alt+Enter` (stop), `Ctrl+,` (settings), `Ctrl+S`/`Ctrl+O` (save/load prompt set), `Ctrl+Z`/`Ctrl+Y`, `Ctrl+\`` (console/debug drawer), `F` (focus mode — hide all chrome), `R` (reload knowledge bank), `P` (pin a result card), `Alt+C` (collapse card). Ship a `?` / bottom-left **Shortcuts** button that opens the sheet — ComfyUI has exactly this button in its bottom-left toolbar, so users will look for it there.

---

### 3. Bare-letter toggles for the 8 side panels
**Effort: moderate**
**Evidence:** §3. `Q`/`W`/`N`/`M` for Queue/Workflows/Nodes/Models are the deepest muscle memory this audience has; *"God I miss the queue sidebar when I press Q"* (@TheNightmare4865, #7195).

**Do:** assign single bare letters to the 8 panels, mnemonic to the panel name, suppressed while a text field has focus. Show the letter as a subtle badge on each panel's trigger. If any Prompt Studio panel is a history/queue analogue, **bind it to `Q`**; if any is a saved-set browser, bind it to `W`.

---

### 4. A real density control: Comfortable / Compact / Ultra-compact
**Effort: moderate (a `data-density` attribute + three variable blocks)**
**Evidence:** §2.3 — the most measurable complaint in the corpus. Issue #6484 asks for it in exactly these words, including a named "ultra compact" tier with *"Shorter header / No space between widgets"*. Sofocletus: *"Node 2.0 shows 7 LoRAs, legacy node shows 42."* TekaiGuy, carsonjones, Moorer624 all independently. `[OFFICIAL]` ComfyUI itself ships **Sidebar Size: normal/small** and **Tree Explorer Item Padding** as settings.

**Do:** three tiers driving `--row-h`, `--pad`, `--font-size`, `--card-gap`. Default to **Compact**, not Comfortable — this audience's default expectation is dense. Persist the choice. Borrow ComfyUI's own setting names so they are recognisable.

---

### 5. Font-size control (UI + intent textarea), 8–24px
**Effort: small**
**Evidence:** `[OFFICIAL]` ComfyUI ships "Textarea Widget Font Size, Range 8–24". Its removal from `comfy.settings.json` was called out as a regression with no workaround (@Sofocletus, #10585). *"the only theme that has easily readable fonts is the light theme but it's too bright … I tried to find a setting in ComfyUI to change the font but couldn't"* (SRStwo). Directly serves projector/classroom legibility and the older-eyes cohort in §2.4.

**Do:** one slider for the intent textarea (the thing people stare at), one for global UI scale. Persist both. A large step of the UI-scale slider doubles as "projector mode".

---

### 6. Protect contrast; add a mid-grey theme between the two you have
**Effort: small CSS**
**Evidence:** §2.4 — *"way too low contrast … For older users like me, or users with reduced eyesight, this new UI is a nightmare"*; *"they simplified it way too much. Makes it harder to use because things are smooth they blend together"*; *"almost invisible data field separation from the background"*; SRStwo's explicit request for *"a light grey or medium grey theme"*.

**Do:** (a) add a WCAG contrast assertion to your build/test notes so `--dim`, `--warn` and `--err` never regress below 4.5:1 on `--panel`/`--panel2`; (b) make input and card boundaries **explicitly visible** — a 1px `--border` on every field, not just a background-lightness change; (c) add a third theme between `#14161a` dark and `#f2f2f3` light (a `#2a2e35`-ish mid-grey, or a slightly dimmed light at ~`#dfe1e4`) — this is a request users made and never got.

---

### 7. Treat result cards as ComfyUI's queue: previews during, final on completion, list *and* grid, arrow-key A/B
**Effort: moderate → structural depending on current implementation**
**Evidence:** §2.6. `[STAFF]` comfydesigner's own corrective spec (2026-01-05): *"preserving list view in addition to bringing back grid view with sampling previews. Jobs will disappear once they're finished and replaced with the respective final output(s), like before."* Plus: *"The assets view does not show the preview images, only the finished image"* (@Jamerrone); *"every output should have it's own preview"* (@Tekaiguy); *"The ability to do A/B testing by quickly arrowing through the queue was super useful"* (@NouberNou); *"before, when I hit Run, I could see the workflow progressing from node to node, now I don't see anything"* (u/Eydahn).

**Do:** (a) a streaming card shows live partial output, then is *replaced in place* by the finished result — no separate "job" and "output" entities; (b) list ⇄ grid toggle; (c) ←/→ steps between result cards for A/B comparison, with a pin (`P`) to hold one for side-by-side; (d) **cards never resize themselves or reflow the ones above** — *"Ensure elements inside don't jump around and the panel doesn't resize on its own"* (levicki). Reserve the card's final height at stream start.

---

### 8. Persist every piece of UI state; never move furniture between versions
**Effort: small (localStorage) + a process commitment**
**Evidence:** §2.5 — *"Constantly moving buttons and introducing disparate paradigms is incredibly confusing and does not offer value"* (#7188); *"with every update more clicks"*; *"AVOID BREAKING MUSCLE MEMORY AT ALMOST ANY COST"* (HN). And levicki's spec line: *"Persist its state — position, size, visibility."* Note @marchcat69 is still running frontend 1.28.8 rather than accept churn.

**Do:** persist open/closed panel, panel width, density, theme, font size, scroll positions, last-used model chips, list-vs-grid. Freeze the header's dropdown grouping and label wording as a compatibility surface. When a layout change is unavoidable, ship it **behind a toggle that defaults off** — this is Comfy-Org's own stated remediation policy (`[STAFF]` comfydesigner, #7107: *"These changes will be opt-in, and in the future larger UI changes like this will be behind a toggle"*). Because Prompt Studio is a single self-contained HTML file, you can go further than Comfy-Org: **ship versioned filenames so the old one keeps working forever offline.** That directly answers the LTS request in §2.5.

---

### 9. Drag-and-drop as a first-class input, and copy the workflow-in-a-PNG idiom
**Effort: moderate**
**Evidence:** §1.4 and §3 — dropping a file onto the canvas to rehydrate full state is the ecosystem's signature portability trick, and its breakage is reported with real anger (@Poukpalaova, #7219). ComfyUI's drag-drop from the Assets panel breaking generated its own issue (#13055).

**Do:** accept a drop anywhere on the app body — a PNG with embedded ComfyUI workflow JSON (parse it, populate model chips + intent from it), a bare workflow `.json`, or a Prompt Studio session `.json`. Symmetrically, let the user **drag a result card out** to export it. Show a full-window drop target with a clear "release to load" state (ComfyUI has a `drag-text` colour token for exactly this — `#ccc`).

---

### 10. Right-click context menus everywhere, and drag-to-scrub numeric fields
**Effort: moderate**
**Evidence:** §3. This audience right-clicks reflexively — *"Right clicking a lora will allow you to show info and open up a dialog… AND THIS DOESN'T HAPPEN IN NODES2.0. This alone makes nodes 2.0 worse"* (u/bronkula). And the mourned scrub: *"I really miss the ability to click and drag (scrub) to change values for things like Seed, Denoise, and CFG… The old 'slider' feel was much faster"* (u/Bitter-Solution1867). Also: *"a clear visual distinction between official nodes and custom nodes"* → distinguish built-in vs user-added presets/chips visually.

**Do:** right-click on a model chip → info / duplicate / remove / set as default. Right-click a result card → copy prompt / copy as ComfyUI workflow / pin / delete. Right-click the intent textarea → your own actions, not just the browser menu. Any numeric field gets click-and-drag scrubbing with Shift for fine and Ctrl for coarse. Keep type-to-filter dropdowns at **two** steps (type → Enter), never three.

---

### 11. Reduce motion; no flashing, no peripheral animation
**Effort: small CSS**
**Evidence:** §2.4 — *"blinking stuff in my peripheral vision seriously triggers my OCD"*; *"Have peripheral vision sensitive to motion"*; *"much to the detriment of his health since a number of the issues affect his photosensitivity problems"* (u/KadahCoba). Also the specific failure mode: on fast hardware a progress indicator *"just flashes and disappears so it's totally, utterly pointless."*

**Do:** honour `prefers-reduced-motion`; add a manual "reduce motion" setting for users whose OS setting is off. Progress indicators get a **minimum visible duration** (~400ms) so they don't strobe on fast completions, or are suppressed entirely below that threshold. No pulsing, no auto-fading overlays, no elements that animate in the periphery while the user types.

---

### 12. One word per concept — audit the vocabulary
**Effort: small (find/replace + a glossary comment)**
**Evidence:** §2.8 — levicki's *"Four words: workflow, graph, blueprint, and the bookmark button that was actually an overview panel"* and *"Workflow is the original term, graph is the same as workflow, group is the original term, app and subgraph are the same as group. It is confusing and unnecessary."*

**Do:** pick exactly one noun for each of: the thing you type (intent? brief? prompt?), the thing you get (result? card? output? generation?), the saved thing (preset? recipe? set? template?), the marked thing (pin? favourite? bookmark? star?). Enforce it across header menus, panel titles, buttons and tooltips. Where a ComfyUI word already exists for the concept (**queue**, **workflow**, **template**, **seed**, **bypass**), use ComfyUI's word.

---

### Runners-up (worth doing, lower ranked)

- **13. Borrow ComfyUI's type-hue grammar for model chips** (`IMAGE #64B5F6` blue, `LATENT #FF9CF9` pink, `CONDITIONING #FFA931` orange, `MODEL #B39DDB` lavender). *Small.* Instant semantic recognition for anyone who reads noodles daily. §3.
- **14. Default to showing everything; make collapsing opt-in.** *Moderate.* §1.1 and §2.7 — *"we use ComfyUI to mess with things under the hood, not to hide from them"*; *"No, I don't want less controls. No, I don't want your streamlined user experience."* Do not ship a "simple mode" as the default.
- **15. Keep seed and its control-mode selector adjacent.** *Small.* §2.7, `[OFFICIAL]` #14102 — separating them is a known, hated regression.
- **16. Desktop density first; do not enlarge targets for touch.** *Small.* §2.9 — thumb-sized UI is read by this audience as evidence of cloud/API drift, not generosity. If you support touch, do it behind the density toggle (§4), not by default.
- **17. Keep DOM churn per streamed token low; virtualise long card lists.** *Moderate.* §2.10 — this audience notices dropped frames and blames the framework.
- **18. Advertise offline / zero-telemetry in the UI itself.** *Small.* §2.12 — trust in this audience is currently low and this is a genuine differentiator.

---

## 6. "Nothing found" register

Areas searched where no usable primary evidence surfaced. These are honest gaps, not absences of opinion.

- **Praise for double-click-to-search specifically** — `[NOT FOUND]`. Only tutorial prose and one r/comfyui thread asking how to *disable* it (https://reddit.com/r/comfyui/comments/1gj4uea/, 0 comments). The convention is real and documented `[OFFICIAL]`, but no user has written a love letter to it that I could locate.
- **Praise for drag-link type filtering** — `[NOT FOUND]`. Only the regression complaint (u/…, r/comfyui 1rszk3y: *"the node menu if you drag from a connector into the empty canvas... wtf? before it was easy and now its stressfull"*).
- **Praise for the Templates browser** — `[NOT FOUND]`. The only template sentiment located is negative (subgraphs in templates, §2.7).
- **Praise for the minimap** — `[NOT FOUND]` as a standalone statement. Only the general 0.3.51 release enthusiasm (§1.7) and pre-existing third-party minimap extensions.
- **Sidebar tabs, positive or negative, as a distinct topic** — `[NOT FOUND]` beyond *"The menu on the left - i hate the new 'design'"*.
- **A substantive keyboard-shortcuts discussion thread** — `[NOT FOUND]`. Searches returned only how-to content. The evidence for §3 is therefore `[OFFICIAL]` documentation plus the *losses* users named, not enthusiasm for the bindings.
- **forum.comfy.org as a source** — effectively `[NOT FOUND]`. One relevant UI thread (https://forum.comfy.org/t/how-to-revert-to-previous-nodes-new-node-design-issues/3980); the feedback categories are near-empty. A user in that very thread: *"I just realized nobody's reading the messages on this forum man"* (nfect, 2025-12-02). **The real feedback venues are GitHub issues and r/comfyui, in that order.**
- **YouTube transcript commentary** — not pursued to depth; the GitHub + Reddit corpus was already saturating.
- **Reaction counts on individual GitHub issues** — the GitHub search API response was truncated before the reactions field could be parsed reliably; the §2.1 table is ordered by the API's `sort=reactions` ranking but exact 👍 counts are not asserted. The one count verified directly: issue #4661's OP carries **3 👍, 6 👎, 2 😕** — a rare case of a staff RFC being net-downvoted.

---

## 7. Source index

**Official / staff**
- ComfyUI keyboard & mouse shortcuts — https://docs.comfy.org/interface/shortcuts
- Customizing ComfyUI Appearance (full theme token list) — https://docs.comfy.org/interface/appearance
- Interface Overview (sidebar panels, new vs old menu) — https://docs.comfy.org/interface/overview
- Nodes 2.0 — https://docs.comfy.org/interface/nodes-2
- Workflow metadata — https://docs.comfy.org/development/api-development/workflow-metadata
- Blog: ComfyUI 0.3.51 — Subgraph, New Manager UI, Mini Map and More (2025-08-21) — https://blog.comfy.org/p/comfyui-035-frontend-updates and its comments https://blog.comfy.org/p/comfyui-035-frontend-updates/comments
- Blog: Try Nodes 2.0 (Beta) (2025-12-05) — https://blog.comfy.org/p/comfyui-node-2-0
- Announcement: Frontend Modernization (2024-08-15) — https://github.com/Comfy-Org/ComfyUI/issues/4169
- Announcement: Making New UI the default (2024-11-15) — https://github.com/comfyanonymous/ComfyUI/issues/5395

**GitHub issues / discussions (Comfy-Org/ComfyUI_frontend unless noted)**
- #4661 Long-Term Architectural Direction — https://github.com/Comfy-Org/ComfyUI_frontend/issues/4661
- #5095 New UI's unnecessary changes: new menus and rows — .../issues/5095
- #6104 Feedback on the floating menus — .../issues/6104
- #6484 [Vue nodes] Add a compact version of the new nodes — .../issues/6484
- #7107 Screw job history (23 comments, richest single thread) — .../issues/7107
- #7184 Suggestions for feedback on Node2's new interface — .../issues/7184
- #7188 A plea: share designs for feedback before implementation — .../issues/7188
- #7195 Please give us back the old UI — .../issues/7195
- #7219 PLEASE STOP FIXING WHAT ISN'T BROKEN — .../issues/7219
- #7772 Very Poorly Planned UI Updates — .../issues/7772
- #8157 Queue panel blocks workflow view — .../issues/8157
- #10585 Stability update and Fix-It Weeks, April 2026 — .../issues/10585
- #10831 Nodes 2.0: DOM rendering performance — .../issues/10831
- #13055 Drag-and-drop from Assets panel broken — .../issues/13055
- #14102 Cannot display control_after_generate in subgraphs — .../issues/14102
- Discussion #12330 (Nodes 2.0 density measurements) — https://github.com/Comfy-Org/ComfyUI_frontend/discussions/12330
- Discussion #11074 "Nodes 2.0, no thanks" — https://github.com/Comfy-Org/ComfyUI/discussions/11074
- ComfyUI #13590 (theme/font legibility) — https://github.com/Comfy-Org/ComfyUI/issues/13590

**Reddit (canonical URLs; content read via Redlib mirror)**
- r/comfyui 1peeqrj (Nodes 2.0 launch, 118 comments) · 1tkqq36 (85 comments) · 1r05zu9 · 1pre00a · 1pi5mqx · 1rszk3y · 1qfnajq (subgraphs in templates) · 1l3xn1m (subgraphs praise) · 1mwtq9w (0.3.51) · 1o7zeo9 (cable management) · 1vi2v3s · 1i1kcpe · 1gcialy · 1s4pci7
- r/StableDiffusion 1hj0edi ("Comfyui is abusive.") · 1oqwj6t

**Hacker News (via Algolia API)**
- 36416769 · 45948285 · 48246474 · 45800413 · 46269308 · 45529254 · 46139538

**Other**
- forum.comfy.org/t/how-to-revert-to-previous-nodes-new-node-design-issues/3980
- Civitai: The "Workflow-in-a-PNG" Trick — https://civitai.com/articles/26592/the-workflow-in-a-png-trick-in-comfyui
- ComfyUI-MobileFriendly — https://github.com/XelaNull/ComfyUI-MobileFriendly
- ComfyUI Color Palettes (Figma community) — https://www.figma.com/community/file/1346736809617182452/comfyui-color-palettes

---

*Compiled 2026-09-01. Prompt Studio palette figures read from `C:\VidGenPrompter\PromptStudio.html` lines 9–16 and keybinding inventory from lines 483, 1056–1058, 1967.*
