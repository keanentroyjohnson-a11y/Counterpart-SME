# Counterpart SME

Counterpart for growing businesses. It is the full Counterpart application (`src/app.js` and its modules, shared with the lawyer edition) with an edition layer in `src/sme.js`.

## How the edition layer works

`src/sme.js` loads after the data and before `app.js`. It:

- narrows `TREE` to the twenty agreements in `SME_IDS` (so `AG`, the library, counts and search all follow);
- defines `SMEX`, the hooks `app.js` calls when present: `header`, `home`, `toolbar`, `views` (extra pages `smeint`, `smedocs`, `smesign`), `click`, `input`, `change`, `started` (after the side picker), `afterSave` and `boot`.

Keep the shared files identical to the lawyer edition. Change behaviour through `SMEX`, not by editing `app.js`; if a new hook is needed, add it to `app.js` behind `typeof SMEX!=="undefined"` so the lawyer edition is unaffected.

## Saved documents

Each draft is a record `{id, ag, title, state, dates, status, sigs, hash, envId}`. `state` is the normal drafting state (`side`, `preset`, `picks`, `parties`, `fill`, `edits`), mounted as `ST.docs["sme-"+id]` and opened with `openAg(ag, null, "sme-"+id)`. Records live in the viewer's private `db` subtree `data/users/<id>/<record id>` (business profile at `profile`), or in localStorage outside Claude. `save()` triggers `SMEX.afterSave`, which saves the open record.

Opening an agreement from the library runs the normal side picker, then `SMEX.started` turns it into a saved record. The guided start (`SME_NEEDS`, `SME_VALUES`, `SME_LEVS`, `SME_PRI`, `smePicks`) creates the record directly: firmer positions on the user's priorities, market elsewhere, shifted by negotiating position.

## Signing

Preparing locks the record (drafting actions are blocked in `SMEX.click`), hashes `docText` with SHA-256 and, in account mode, writes the envelope to the shared `sign/<code>` document. The other party, shared the page as a Contributor, opens Your documents, then Sign a document sent to you, enters the code, sees the text verified against the hash, and signs. Deeds are signed on paper with a witness and recorded. Exports of signed records add the signatures and an electronic signature certificate.

## Commands

- `npm run check`: builds every guided-start route at every negotiating position and checks the drafts and screens. Must print `ALL CLEAN`.
- `npm run build`: writes `dist/index.html` and `dist/artifact.html`. Publish the artifact with the `db`, `user`, `downloads` and `sample` capabilities.
- `npm run serve`: http://localhost:8000.

## Standards

Same as Counterpart: English law, accurate citations, `{R:}` and `{SC:}` tokens, plain English in explanations, no em dashes, keep the not legal advice notices.
