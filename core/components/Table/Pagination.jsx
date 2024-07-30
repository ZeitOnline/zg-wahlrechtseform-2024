import React, {useMemo} from 'react';
import {useTable} from './TableContainer';
import {LightButton} from 'core/components/Button';
import Left from 'core/icons/chevron-left.svg?react';
import Right from 'core/icons/chevron-right.svg?react';
import cn from './Pagination.module.scss';
import range from 'core/utils/range';

function Pagination({showPrevNext, showPageNumbers}) {
  const {page, setPage, nPages} = useTable();

  const pages = useMemo(() => {
    return range(page - 2, page + 3).filter((d) => d >= 0 && d < nPages);
  }, [nPages, page]);

  return (
    <div className={cn.pagination}>
      {showPrevNext && (
        <LightButton
          className={cn.prev}
          disabled={page === 0}
          onClick={() => void setPage((prev) => prev - 1)}
        >
          <Left />
        </LightButton>
      )}
      {showPageNumbers &&
        pages.map((i) => (
          <LightButton
            key={`goto-${i}`}
            className={cn.goto}
            disabled={page === i}
            onClick={() => void setPage(i)}
          >
            {i + 1}
          </LightButton>
        ))}
      {showPrevNext && (
        <LightButton
          className={cn.next}
          disabled={page + 1 === nPages}
          onClick={() => void setPage((prev) => prev + 1)}
        >
          <Right />
        </LightButton>
      )}
    </div>
  );
}

export default Pagination;
