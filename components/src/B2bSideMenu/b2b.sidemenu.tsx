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
import { Route, Link } from 'react-router-dom';
import intl from 'react-intl-universal';
import './b2b.sidemenu.less';

interface B2bSideMenuProps {
    sideMenuItems: any,
}
interface B2bSideMenuState {
    isOpen: boolean,
}

export default class B2bSideMenu extends React.Component<B2bSideMenuProps, B2bSideMenuState> {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };

    this.clickListener = this.clickListener.bind(this);
  }

  handleSwitcherClicked(e) {
    this.setState({ isOpen: true });
    document.addEventListener('click', this.clickListener);

    e.preventDefault();
    e.stopPropagation();
  }

  clickListener() {
    this.setState({ isOpen: false });
    document.removeEventListener('click', this.clickListener);
  }

  render() {
    const { sideMenuItems } = this.props;
    const { isOpen } = this.state;
    const currentSideMenuItems = sideMenuItems.filter(el => el.to === window.location.pathname);
    return (
      <div className="side-menu-component">
        <button
          className="side-menu-component-title"
          onClick={e => this.handleSwitcherClicked(e)}
          type="button"
        >
          {currentSideMenuItems.length > 0 && intl.get(currentSideMenuItems[0].children)}
        </button>
        <div className={`side-menu-component-dropdown ${isOpen ? '' : 'hidden'}`}>
          {sideMenuItems.map(elem => (
            <div key={elem.children}>
              <Route
                path={elem.to}
                exact
              >
                <Link className={`menu-item ${window.location.pathname === elem.to ? 'selected' : ''}`} to={elem.to}>
                  {intl.get(elem.children)}
                </Link>
              </Route>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
