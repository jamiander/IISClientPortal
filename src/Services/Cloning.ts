
export function MakeClone<Type>(source: Type) : Type;
export function MakeClone<Type>(source: undefined) : undefined;
export function MakeClone<Type>(source: Type | undefined) : Type | undefined
{
  if(source === undefined)
    return undefined;

  const clone: Type = JSON.parse(JSON.stringify(source));
  return clone;
}

