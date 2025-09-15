export const validateDueDate = (inputDate: Date) => {
  const currentDate = new Date();
  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(currentDate.getMonth() + 1);

  const dueDate = new Date(inputDate);
  return dueDate.getTime() > oneMonthFromNow.getTime();
};
