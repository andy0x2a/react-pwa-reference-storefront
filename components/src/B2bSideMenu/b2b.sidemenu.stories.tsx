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
import { storiesOf } from '@storybook/react';
import { Router } from 'react-router';
import { action } from '@storybook/addon-actions';
import createMemoryHistory from 'history/createMemoryHistory';
import B2bSideMenu from './b2b.sidemenu';

const history = createMemoryHistory();

history.push = action('history.push');

const sideMenuItems = [
  { to: '/b2b', children: 'dashboard' },
  { to: '/b2b/address-book', children: 'address-book' },
  { to: '/b2b/orders', children: 'orders' },
  { to: '/b2b/approvals', children: 'approvals' },
  { to: '/b2b/invitations', children: 'invitations' },
  { to: '/b2b/requisition-lists', children: 'requisition-lists' },
  { to: '/b2b/quotes', children: 'quotes' },
];

storiesOf('B2bSideMenu', module)
  .addDecorator(story => <Router history={history}>{story()}</Router>)
  .add('B2bSideMenu', () => (
    <B2bSideMenu sideMenuItems={sideMenuItems} />
  ));
