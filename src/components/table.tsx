import { Table } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { ExpandableConfig, FilterValue, GetRowKey, SorterResult } from 'antd/es/table/interface';
import type { SetURLSearchParams } from 'react-router-dom';
import { DatePicker } from './antd';
import qs from 'qs';
import moment from 'moment';

type DataTableProps<DataType> = {
  title: React.ReactNode;
  subtitle?: string;
  rowKey: string | keyof DataType | GetRowKey<DataType>;
  columns: ColumnsType<DataType>;
  data: DataType[];
  loading: boolean;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  }
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
  summary?: ((data: readonly DataType[]) => React.ReactNode),
  bordered?: boolean;
  expandable?: ExpandableConfig<DataType>;
}

export function DataTable<DataType extends object>({
  title,
  subtitle,
  rowKey,
  columns,
  data,
  loading,
  pagination,
  searchParams,
  setSearchParams,
  summary,
  bordered,
  expandable,
}: DataTableProps<DataType>) {
  const params = qs.parse(searchParams.toString());
  const startDate = String(params.startDate ?? moment().startOf('month').format('YYYY-MM-DD'));
  const endDate = String(params.endDate ?? moment().endOf('month').format('YYYY-MM-DD'));
  function onChange(
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<DataType> | SorterResult<DataType>[],
  ) {
    params.page = String(pagination.current);
    params.limit = String(pagination.pageSize);

    if (!Array.isArray(sorter) && sorter.field && sorter.order) {
      params.orderBy = String(sorter.field);
      params.orderType = sorter.order === 'ascend' ? 'asc' : 'desc';
    } else {
      delete params.orderBy;
      delete params.orderType;
    }

    if (filters) {
      const newFilters: { [key: string]: string | string[] } = {};
      for (const filter in filters) {
        const newFilter = filters[filter];
        if (newFilter) {
          newFilters[filter] = newFilter.map((status) => String(status));
        }
      }
      params.filters = Object.assign({}, params.filters ?? {}, newFilters);
    } else {
      delete params.filters;
    }

    setSearchParams(qs.stringify(params), { replace: true });
  }

  return (
    <div className='bg-white shadow rounded-lg'>
      <div className="p-4 flex justify-between items-center">
        <div>
          <h2 className="font-semibold">{title}</h2>
          {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
        </div>
        <div>
          <DatePicker.RangePicker
            allowClear={false}
            value={[moment(startDate), moment(endDate)]}
            onChange={(val) => {
              if (val) {
                params.startDate = val[0]?.format('YYYY-MM-DD');
                params.endDate = val[1]?.format('YYYY-MM-DD');
              } else {
                delete params.startDate;
                delete params.endDate;
              }
              setSearchParams(qs.stringify(params), { replace: true });
            }}
          />
        </div>
      </div>
      <div className='p-4' id='table-container'>
        <Table
          rowKey={rowKey}
          columns={columns}
          dataSource={data}
          loading={loading}
          onChange={onChange}
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            pageSizeOptions: [5, 10, 20, 30, 50, 100],
            showSizeChanger: true,
            total: pagination.total,
          }}
          scroll={{ x: '100%', y: '100%' }}
          summary={summary}
          bordered={bordered}
          expandable={expandable}
          sticky={{
            offsetHeader: -16,
            // offsetScroll: 0,
            // getContainer: () => document.getElementById('table-container') as unknown as HTMLElement
            getContainer: () => document.getElementById('main-content') as HTMLElement,
          }}
        />
      </div>
    </div>
  );
}
