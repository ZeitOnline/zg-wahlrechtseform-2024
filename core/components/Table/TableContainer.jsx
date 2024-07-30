import React, {
  createContext,
  Fragment,
  memo,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import cn from './index.module.scss';
import noop from 'core/utils/noop';
import {Row, Cell} from './CellsAndRows';
import Pagination from './Pagination';
import isFinite from 'core/utils/isFinite';
import ExpandButton from './ExpandButton';
import getSortingFn from 'core/utils/getSortingFn';

const TableContext = createContext({
  data: [],
  sortedBy: null,
  setSortedBy: noop,
  sortOrder: 'asc',
  setSortOrder: noop,
});

export function useTable() {
  return useContext(TableContext);
}

function getDefaultRenderRow(obj) {
  return (
    <Row>
      {Object.keys(obj).map((key) => {
        <Cell>{obj[key]}</Cell>;
      })}
    </Row>
  );
}

/**
 * This is your one-size-fits-all component for all things that should
 * look like a table – meaning: Some column headers and a bunch of rows.
 * The component also exports a hook `useTable()` through wich you can
 * access the sorted and filtered data or the current page.
 * Under the hood, each row of the table uses CSS grid to position the cells.
 * Each row is its own grid and will be passed `grid-template-columns` by the
 * `<TableContainer />` wrapper – this ensures that all cells have the same
 * widths and it offers a nice API to make use of cool things like `repeat()`
 * or the CSS unit `fr` (short for fraction).
 */
const Table = memo(function ({
  data: originalData = [],
  header = null,
  stickyHeader = true,
  nTop,
  nTopFlop,
  expandButtonText = 'Alle anzeigen',
  collapseButtonText = 'Weniger anzeigen',
  renderRow,
  widths,
  titleWidths,
  areas,
  titleAreas,
  colGap,
  rowGap,
  innerRowGap,
  initialSortedBy,
  initialSortOrder = 'asc',
  showPrevNext,
  showPageNumbers,
  debug,
}) {
  const ref = useRef(null);
  const [page, setPage] = useState(0);
  const [isExpanded, setIsExpanded] = useState(
    // if both nTop and nTopFlop are undefined
    !isFinite(nTop) && !isFinite(nTopFlop),
  );
  const [sortedBy, setSortedBy] = useState(initialSortedBy);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);
  if (!renderRow || typeof renderRow !== 'function') {
    console.error(
      'renderRow has to be a function that renders a row, fallback is rendered',
    );
    renderRow = getDefaultRenderRow(originalData?.[0] || {});
  }
  const value = useMemo(() => {
    if (debug) console.time('Table context');
    const sortLookup = [...originalData]
      .sort(getSortingFn(initialSortedBy, initialSortOrder))
      .map((e) => e[initialSortedBy]);
    const sortedData = [...originalData]
      // Add rank here 1, 2, 2, 4…
      .map((d) => {
        const firstWithSameValue = sortLookup.indexOf(d[initialSortedBy]);
        return {rank: firstWithSameValue + 1, ...d};
      })
      // sort by 'users wish'
      .sort(getSortingFn(sortedBy, sortOrder));
    const nRows = originalData?.length;
    const nVisible = isFinite(nTop)
      ? nTop
      : isFinite(nTopFlop)
        ? nTopFlop * 2
        : nRows;
    const showPagination = showPageNumbers || showPrevNext;
    const showExpandButton = nRows > nVisible && !showPagination;
    // These are the currently visible entries
    let visibleData = sortedData;
    let expandButtonPosition = nRows - 1;
    if (isFinite(nTop) && nRows > nTop && !isExpanded) {
      visibleData = sortedData.slice(page * nTop, (page + 1) * nTop);
      expandButtonPosition = nTop - 1;
    } else if (isFinite(nTopFlop) && nRows > nTopFlop * 2 && !isExpanded) {
      visibleData = [
        ...sortedData.slice(0, nTopFlop),
        ...sortedData.slice(-nTopFlop),
      ];
      expandButtonPosition = nTopFlop - 1;
    }
    // beware: header might have different number of cols than body
    const nCols = header?.props?.children?.length;
    const result = {
      // complete dataset (sorted)
      sortedData,
      // visible data entries
      visibleData,
      // number of entries to show from the top
      nTop,
      // number of entries to show from top and bottom
      nTopFlop,
      // probable number of columns (TitleRow is used for that)
      nCols,
      // number of total rows
      nRows,
      // number of visible rows ()
      nVisible,
      // boolean that indicates whether a pagination is used
      showPagination,
      // boolean that indicates whether an expand button is needed
      showExpandButton,
      // index of where the expand button should be rendered
      expandButtonPosition,
      // key by which the data is sorted
      sortedBy,
      // pass a new key to sort by here
      setSortedBy,
      // either ascending (asc) or descending (desc)
      sortOrder,
      // setState for the sort order, only pass asc or desc!
      setSortOrder,
      // if nothing else is passed, just use repeat 1fr as default
      widths: widths || `repeat(${nCols}, 1fr)`,
      // same for the title row
      titleWidths: titleWidths || widths || `repeat(${nCols}, 1fr)`,
      // will be used as template-grid-areas in rows
      areas,
      // same for the title row
      titleAreas: titleAreas || areas,
      // makes the TitleRow have position: sticky
      stickyHeader,
      // gap between the columns (css grid)
      colGap,
      // gap between the rows (margin-bottom)
      rowGap,
      // gap between rows within one data entry, within one css grid
      innerRowGap,
      // state and setState for pagination
      page,
      setPage,
      // number of pages to show in a pagination
      nPages: nTop ? Math.ceil(originalData?.length / nTop) : undefined,
      // boolean that indicates whether the expand button has been clicked
      isExpanded,
      // set to true on expand button click
      setIsExpanded,
    };
    if (debug) console.timeEnd('Table context');
    if (debug) console.log(result);
    return result;
  }, [
    debug,
    originalData,
    initialSortedBy,
    initialSortOrder,
    sortedBy,
    sortOrder,
    nTop,
    nTopFlop,
    showPageNumbers,
    showPrevNext,
    isExpanded,
    header?.props?.children?.length,
    widths,
    titleWidths,
    areas,
    titleAreas,
    stickyHeader,
    colGap,
    rowGap,
    innerRowGap,
    page,
  ]);

  return (
    <TableContext.Provider value={value}>
      <div {...{ref}} />
      <div className={cn.table} role="table">
        {header}
        {value.visibleData.map((d, i, a) => {
          return (
            <Fragment key={`row-${i}`}>
              {/* Pass context as a fourth argument to enable use of render props */}
              {renderRow(d, i, a, value)}
              {i === value.expandButtonPosition && (
                <ExpandButton scrollIntoViewRef={ref}>
                  {value.isExpanded ? collapseButtonText : expandButtonText}
                </ExpandButton>
              )}
            </Fragment>
          );
        })}
      </div>
      {(showPrevNext || showPageNumbers) && (
        <Pagination {...{showPrevNext, showPageNumbers}} />
      )}
    </TableContext.Provider>
  );
});

Table.propTypes = {
  /** Array of object that you want to render in the table */
  data: PropTypes.array,
  /** Instance of `<TitleRow><TitleCell>Lable</TitleCell></TitleRow>` */
  header: PropTypes.node,
  /** Should the header scroll over the body (position: `sticky`) */
  stickyHeader: PropTypes.bool,
  /** Number of rows that should be shown by default */
  nTop: PropTypes.number,
  /** Alternatively, you can show the first and the last n entries */
  nTopFlop: PropTypes.number,
  /** The text rendered in the expand button */
  expandButtonText: PropTypes.string,
  /** The text rendered in the expand button when rows are visible */
  collapseButtonText: PropTypes.string,
  /** Must be a function that is called with one data entry and renders a row */
  renderRow: PropTypes.func,
  /** CSS `grid-template-columns` syntax! This style will be applied to each row */
  widths: PropTypes.string,
  /** Same for the title row */
  titleWidths: PropTypes.string,
  /** CSS `grid-template-areas` syntax! This style will be applied to each row  */
  areas: PropTypes.string,
  /** Same for the title row */
  titleAreas: PropTypes.string,
  /** CSS `grid-column-gap` setting */
  colGap: PropTypes.number,
  /** Will be added as a margin between the rows */
  rowGap: PropTypes.number,
  /** CSS `grid-row-gap` setting for grids inside row (only useful if two rows within each entry) */
  innerRowGap: PropTypes.number,
  /** Pass `true` if you want a small left and right caret to be shown below the table */
  showPrevNext: PropTypes.bool,
  /** Pass `true` if you want the current page number plus minus two Go-To-Buttons shown below the table */
  showPageNumbers: PropTypes.bool,
  /** Accessor string that the table should be sorted by (optional) */
  initialSortedBy: PropTypes.string,
  /** Ascending is A-Z in strings */
  initialSortOrder: PropTypes.oneOf(['asc', 'desc']),
  /** Pass `true` if you want the containers context to be logged on each change */
  debug: PropTypes.bool,
  /** Will be rendered below the table so you can build your own pagination */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
  ]),
};

Table.displayName = 'Table';

export default Table;
