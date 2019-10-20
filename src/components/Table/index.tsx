import React, { useContext, useEffect } from 'react';
import MaterialTable, { QueryResult, Query } from 'material-table';
import I18n from '../../I18n';
import { withRouter, RouteComponentProps } from 'react-router';
import queryString from 'query-string';

interface IProps extends RouteComponentProps {
  columns: Record<string, any>[];
  data:
    | Record<string, any>[]
    | ((
        query: Query<Record<string, any>>
      ) => Promise<QueryResult<Record<string, any>>>);
  actions?: any;
  title?: string;
  exportButton?: boolean;
  editable?: Record<string, any>;
  total?: number;
  search?: boolean;
  offset?: number;
  draggable?: boolean;
  detailPanel?: (rowData: any) => JSX.Element;
  exportCsv?: (columns: any, data: any) => void;
  onRowClick?: (e: any, b: any) => void;
  onFilterChange?: (e: any) => void;
  onSearchChange?: (e: string) => void;
}
function Table(props: IProps) {
  const t = useContext(I18n);

  const { limit = 10, offset = props.offset || 0 } = queryString.parse(
    props.history.location.search
  );

  const _limit = Number(limit) || 10;

  function changeFilter(obj: Record<string, any>, replace?: boolean) {
    const params = queryString.stringify({
      ...queryString.parse(props.history.location.search),
      ...obj
    });
    if (replace) props.history.replace(`?${params}`);
    else props.history.push(`?${params}`);
    if (props.onFilterChange) props.onFilterChange(`?${params}`);
  }

  useEffect(() => {
    changeFilter({ limit, offset }, true);
  }, []);

  return (
    <div style={{ maxWidth: '100%' }}>
      <MaterialTable
        onChangeRowsPerPage={limit => {
          changeFilter({ limit, offset: 0 });
        }}
        onSearchChange={props.onSearchChange}
        localization={{
          pagination: {
            labelDisplayedRows: `{from}-{to}  ${t('int.of')}  {count}`,
            labelRowsSelect: t('int.rows'),
            firstTooltip: t('int.table.first-page'),
            previousTooltip: t('int.table.previous-page'),
            nextTooltip: t('int.table.next-page'),
            lastTooltip: t('int.table.last-page')
          },
          toolbar: {
            nRowsSelected: `{0} ${t('int.row')} ${t('int.selected')}`,
            showColumnsTitle: t('int.show-columns'),
            exportTitle: t('int.action-export')
          },
          header: {
            actions: t('int.actions')
          },
          body: {
            addTooltip: t('int.action-add'),
            editTooltip: t('int.action-edit'),
            emptyDataSourceMessage: t(`int.no-records-to-display`),
            editRow: {
              deleteText: t('int.are-you-sure-you-want-to-delete-row?'),
              cancelTooltip: t('int.cancel-tooltip'),
              saveTooltip: t('int.save-tooltip')
            },
            filterRow: {
              filterTooltip: t(`int.filter`)
            }
          }
        }}
        editable={props.editable}
        onRowClick={props.onRowClick}
        detailPanel={props.detailPanel}
        totalCount={props.total}
        page={Number(offset) / Number(limit)}
        options={{
          pageSizeOptions: [5, 10, 15],
          showFirstLastPageButtons: true,
          toolbar: Boolean(props.actions),
          pageSize: Math.max(_limit, 1),
          actionsColumnIndex: -1,
          search: props.search || false,

          headerStyle: {
            backgroundColor: '##fafafa',
            color: '#263238'
          },
          sorting: false,
          addRowPosition: 'first',
          columnsButton: true,
          exportButton: props.exportButton,
          exportCsv: props.exportCsv
        }}
        onChangePage={offset => {
          changeFilter({ offset: offset * Number(limit) });
        }}
        actions={props.actions || []}
        columns={props.columns}
        data={props.data}
        title={props.title || ''}
      />
    </div>
  );
}

export default withRouter(Table);
