export function SuttaContent({ html }: { html: string }) {
  return (
    <div
      className="prose prose-lg max-w-none"
      data-pagefind-body
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
