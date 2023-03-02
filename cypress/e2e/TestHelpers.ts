
//cypress can find items by id using "#id"
export function AddHash(obj: any)
{
  if(typeof(obj) == 'string')
    return "#" + obj;

  const newObj = JSON.parse(JSON.stringify(obj));
  for(let key of Object.keys(obj))
  {
    newObj[key] = AddHash(obj[key]);
  }
  return newObj;
}
