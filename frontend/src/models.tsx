export class Summary {
  total = 0;
  by_year: [string, number][] = [];
  by_month: [string, number][] = [];
}

export class Tag extends Summary {
  id = -1;
  name = "";
  color = "";
  icon = "cash";
  sum? = 0;
}

export class Expenditure {
  username = "";
  amount = 0;
  reason = "";
  id = -1;
  tags: Tag[] = [];
  created_date = "";
}
