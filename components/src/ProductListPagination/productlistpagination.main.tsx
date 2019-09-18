
/**
 * Copyright © 2019 Elastic Path Software Inc. All rights reserved.
 *
 * This is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this license. If not, see
 *
 *     https://www.gnu.org/licenses/
 *
 *
 */

import React from 'react';
import { getConfig } from '../utils/ConfigProvider';

import './productlistpagination.less';

let intl = { get: str => str };

interface ProductListPaginationProps {
  paginationDataProps: { [key: string]: any },
}

function ProductListPagination(props: ProductListPaginationProps) {
  ({ intl } = getConfig());
  const { paginationDataProps } = props;

  if (paginationDataProps.pagination) {
    return (
      <div className="product-list-pagination-component" data-region="categoryPaginationRegion" style={{ display: 'block' }}>
        <div className="total-results">
          <span className="total-results-value">
            {intl.get('viewing')}
            &nbsp;
            {paginationDataProps.pagination.resultsOnPage}
          </span>
          &nbsp;
          <span className="results-displayed-value">
            {intl.get('of')}
            &nbsp;
            {paginationDataProps.pagination.results}
            &nbsp;
            {intl.get('products')}
          </span>
        </div>
      </div>
    );
  }

  return (<div className="loader" />);
}

export default ProductListPagination;
