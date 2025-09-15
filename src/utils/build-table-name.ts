export const buildTableName = (table: string) => {
  const name = `"librica"."${table}"`;
  console.log(name);
  return name;
};
