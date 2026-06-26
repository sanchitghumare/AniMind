export default function isActionRequest(message) {
  const text = message.toLowerCase();

  return /\b(add|remove|delete|rate|mark|update|change|move|complete|finish|drop)\b/.test(text);
}