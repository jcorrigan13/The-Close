export function IslandPulse({ items }: { items: string[] }) {
  return (
    <article className="paperPanel islandPulse">
      <div className="paperTape" aria-hidden="true" />
      <p className="eyebrow">Skerrybrae Today</p>
      <h2>Island Pulse</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}
