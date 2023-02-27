
//cypress can find items by id using "#id"
export function AddHash(obj: any)
{
  const newObj = JSON.parse(JSON.stringify(obj));
  for(let key of Object.keys(obj))
  {
    if(typeof(obj[key]) == 'object')
      newObj[key] = AddHash(obj[key]);
    else
      newObj[key] = "#" + obj[key];
  }
  return newObj;
}
