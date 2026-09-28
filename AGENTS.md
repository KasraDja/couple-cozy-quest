<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Store couple membership, shared ideas, and completed dates in Lovable Cloud with row-level access; this keeps each pair's data private and synchronized.
- Derive XP from completed dates rather than storing mutable totals; deleting a date should reverse its reward consistently.
- Keep avatar rendering in a reusable SVG component; it supports live wardrobe changes without external image dependencies.
