export interface RequestQuery {
  sort?: string;
  page?: number;
  perpage?: number;
  offset?: number;
  where?: string;
  where_value?: string;
  order_by?: string;
  desc?: string;
  group_by?: string;
  relations?: string;
}
