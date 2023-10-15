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
  public amount = 0;
  public reason = "";
  public id = -1;
  public tags: Tag[] = [];
  public created_date: string;
  constructor(public username: string) {
    this.created_date = new Date().toISOString();
  }
}
