import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import {useTable} from './TableContainer';
import cn from './CellsAndRows.module.scss';
import cx from 'classnames';

const generalPropTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
  ]),
  style: PropTypes.object,
  className: PropTypes.string,
};

export function TitleRow({children, style, className, ...props}) {
  const {
    stickyHeader,
    titleWidths,
    widths,
    titleAreas,
    colGap,
    rowGap,
    innerRowGap,
  } = useTable();
  return (
    <div
      className={cx(cn.titleRow, className, {
        [cn.stickyTitleRow]: stickyHeader,
      })}
      style={{
        gridTemplateColumns: titleWidths || widths,
        gridTemplateAreas: titleAreas,
        gridColumnGap: colGap,
        gridRowGap: innerRowGap,
        marginBottom: rowGap,
        ...style,
      }}
      role="rowgroup columnheader"
      {...props}
    >
      {children}
    </div>
  );
}

TitleRow.propTypes = {
  ...generalPropTypes,
};

export function TitleCell({
  children,
  style,
  className,
  sortBy,
  area,
  ...props
}) {
  const {data, sortOrder, setSortOrder, sortedBy, setSortedBy, titleAreas} =
    useTable();

  const onClick = useCallback(() => {
    if (!sortBy) return;
    // Wenn bereits nach diesem Key sortiert: Sortierung umkehren
    if (sortBy === sortedBy) {
      setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      // sonst setzen und für Strings aufsteigend und Nummern absteigend
      setSortedBy(sortBy);
      const newSortType = typeof data?.[0]?.[sortBy];
      setSortOrder(newSortType === 'string' ? 'asc' : 'desc');
    }
  }, [data, setSortOrder, setSortedBy, sortBy, sortedBy]);

  return (
    <button
      className={cx(cn.titleCell, className, {
        [cn.titleCellActive]: sortBy === sortedBy,
      })}
      disabled={!sortBy}
      data-sort-order={sortOrder}
      style={{
        gridArea: titleAreas ? area : undefined,
        ...style,
      }}
      {...{onClick, ...props}}
    >
      {children}
    </button>
  );
}

TitleCell.propTypes = {
  ...generalPropTypes,
  /** Key by which the data should be sorted by when cell is clicked */
  sortBy: PropTypes.string,
  /** Grid Area where this Cell should be displayed */
  area: PropTypes.string,
};

export function Row({children, style, className, ...props}) {
  const {widths, areas, colGap, rowGap, innerRowGap} = useTable();

  return (
    <div
      className={cx(cn.row, className)}
      {...props}
      style={{
        gridTemplateColumns: widths,
        gridTemplateAreas: areas,
        gridColumnGap: colGap,
        gridRowGap: innerRowGap,
        marginBottom: rowGap,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

Row.propTypes = {
  ...generalPropTypes,
};

export function Cell({children, area, ...props}) {
  const {areas} = useTable();

  return (
    <div style={{gridArea: areas ? area : undefined}} {...props}>
      {children}
    </div>
  );
}

Cell.propTypes = {
  ...generalPropTypes,
  /** Grid Area where this Cell should be displayed */
  area: PropTypes.string,
};
