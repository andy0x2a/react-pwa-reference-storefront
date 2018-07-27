/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 */

import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router';
import {
  login, loginRegistered, registerUser, getRegistrationForm,
} from '../utils/AuthService';

const Config = require('Config');

class RegistrationFormMain extends React.Component {
  static propTypes = {
    location: ReactRouterPropTypes.location.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      username: '',
      password: '',
      failedLogin: false,
      failedRegistration: false,
      registrationErrors: '',
    };
    this.setFirstName = this.setFirstName.bind(this);
    this.setLastName = this.setLastName.bind(this);
    this.setUsername = this.setUsername.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.registerNewUser = this.registerNewUser.bind(this);
  }

  componentDidMount() {
    login().then(() => {
      getRegistrationForm();
    });
  }

  setFirstName(event) {
    this.setState({ firstname: event.target.value });
  }

  setLastName(event) {
    this.setState({ lastname: event.target.value });
  }

  setUsername(event) {
    this.setState({ username: event.target.value });
  }

  setPassword(event) {
    this.setState({ password: event.target.value });
  }

  registerNewUser() {
    const {
      lastname, firstname, username, password,
    } = this.state;
    const { location, history } = this.props;
    login().then(() => {
      registerUser(lastname, firstname, username, password).then((res) => {
        if (res.status === 201) {
          this.setState({ failedRegistration: false });
          if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) === 'PUBLIC') {
            loginRegistered(username, password).then((resStatus) => {
              if (resStatus === 401) {
                this.setState({ failedLogin: true });
                let debugMessages = '';
                res.json().then((json) => {
                  for (let i = 0; i < json.messages.length; i++) {
                    debugMessages = debugMessages.concat(`- ${json.messages[i]['debug-message']} \n `);
                  }
                }).then(() => this.setState({ registrationErrors: debugMessages }));
              }
              if (resStatus === 400) {
                this.setState({ failedLogin: true });
                let debugMessages = '';
                res.json().then((json) => {
                  for (let i = 0; i < json.messages.length; i++) {
                    debugMessages = debugMessages.concat(`- ${json.messages[i]['debug-message']} \n `);
                  }
                }).then(() => this.setState({ registrationErrors: debugMessages }));
              } else if (resStatus === 200) {
                if (location.state && location.returnPage) {
                  history.push(location.state.returnPage);
                } else {
                  history.push('/');
                }
              }
            });
          }
        } else {
          this.setState({ failedRegistration: true });
          let debugMessages = '';
          res.json().then((json) => {
            for (let i = 0; i < json.messages.length; i++) {
              debugMessages = debugMessages.concat(`- ${json.messages[i]['debug-message']} \n `);
            }
          }).then(() => this.setState({ registrationErrors: debugMessages }));
        }
      });
    });
  }

  render() {
    const { failedRegistration, failedLogin, registrationErrors } = this.state;
    return (
      <div className="registration-container container">
        <h3>
          Register a New Account
        </h3>

        <div className="feedback-label registration-form-feedback-container feedback-display-linebreak" id="registration_form_feedback_container" data-region="registrationFeedbackMsgRegion">
          {failedRegistration || failedLogin ? (registrationErrors) : ('')}
        </div>

        <div data-region="registrationFormRegion" style={{ display: 'block' }}>
          <div className="container">
            <form className="form-horizontal">
              <div className="form-group">
                <label htmlFor="registration_form_firstName_label" data-el-label="registrationForm.firstName" className="control-label registration-form-label">
                  <span className="required-label">
                    *
                  </span>
                  {' '}
                  First Name
                </label>
                <div className="registration-form-input">
                  <input id="registration_form_firstName" name="given-name" className="form-control" type="text" onChange={this.setFirstName} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="registration_form_lastName_label" data-el-label="registrationForm.lastName" className="control-label registration-form-label">
                  <span className="required-label">
                    *
                  </span>
                  {' '}
                  Last Name
                </label>
                <div className="registration-form-input">
                  <input id="registration_form_lastName" name="family-name" className="form-control" type="text" onChange={this.setLastName} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="registration_form_emailUsername_label" data-el-label="registrationForm.emailUsername" className="control-label registration-form-label">
                  <span className="required-label">
                    *
                  </span>
                  {' '}
                  Email/Username
                </label>
                <div className="registration-form-input">
                  <input id="registration_form_emailUsername" name="username" className="form-control" type="text" onChange={this.setUsername} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="registration_form_password_label" data-el-label="registrationForm.password" className="control-label registration-form-label">
                  <span className="required-label">
                    *
                  </span>
                  {' '}
                  Password
                </label>
                <div className="registration-form-input">
                  <input id="registration_form_password" name="password" className="form-control" type="password" onChange={this.setPassword} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="registration_form_passwordConfirm_label" data-el-label="registrationForm.passwordConfirm" className="control-label registration-form-label">
                  <span className="required-label">
                    *
                  </span>
                  {' '}
                  Password Confirmation
                </label>
                <div className="registration-form-input">
                  <input id="registration_form_passwordConfirm" name="passwordConfirm" className="form-control" type="password" onChange={this.setPasswordConfirmation} />
                </div>
              </div>
              <div className="form-group">
                <input className="btn btn-primary registration-save-btn" id="registration_form_register_button" data-cmd="register" type="button" onClick={this.registerNewUser} value="Submit" />
              </div>
            </form>
          </div>
        </div>

      </div>
    );
  }
}

export default withRouter(RegistrationFormMain);