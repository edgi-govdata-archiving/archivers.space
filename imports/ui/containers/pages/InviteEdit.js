/* eslint-disable react/prop-types, react/jsx-no-bind, jsx-a11y/label-has-for, react/forbid-prop-types, react/require-default-props */
import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Accounts } from 'meteor/accounts-base';

import Invites from '../../../api/invites';

import Spinner from '../../components/Spinner';
import NotFound from '../../components/pages/NotFound';

class Invite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      username: '',
      password: '',
      passwordRepeat: '',
    };
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.state.password !== this.state.passwordRepeat) {
      this.setState({ error: 'password mismatch' });
      return;
    }

    Accounts.createUser({
      invitationId: this.props.invite._id,
      username: this.state.username,
      password: this.state.password,
    }, (err, user) => {
      // eslint-disable-next-line no-console
      console.log(err, user);

      if (err) {
        this.setState({ error: err.message });
      } else {
        browserHistory.push('/urls');
      }
    });
  }

  handleChange(name, e) {
    this.setState({ [name]: e.target.value });
  }

  render() {
    const { currentUser, invite } = this.props;
    const { username, password, passwordRepeat, error } = this.state;

    // If a user is logged in, they shouldn't be looking at an invite
    if (currentUser) {
      browserHistory.push(`/users/${currentUser.username}`);
      return <Spinner />;
    }

    // Don't admit to this route existing without having a valid ID
    if (!invite) {
      return <NotFound />;
    }

    if (invite.used) {
      return (
        <div id="invite" className="model page">
          <div className="container">
            <div className="col-6 offset-3">
              <h3>This invite has already been used.</h3>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div id="invite" className="model page">
        <div className="container">
          <div className="col-6 offset-3">
            <form className="form" onSubmit={this.handleSubmit.bind(this)}>
              <h1 className="title">Join</h1>
              <p className="has-error">{error}</p>
              <div className="form-group">
                <label>Username</label>
                <input className="form-control" type="text" value={username} onChange={this.handleChange.bind(this, 'username')} />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input className="form-control" type="password" value={password} onChange={this.handleChange.bind(this, 'password')} />
              </div>
              <div className="form-group">
                <label>Repeat Password</label>
                <input className="form-control" type="password" value={passwordRepeat} onChange={this.handleChange.bind(this, 'passwordRepeat')} />
              </div>
              <div>
                <hr />
                <h3>Disclaimer for Archivers / archivers.space</h3>
                <p>If you require any more information or have any questions about our site&apos;s disclaimer, please feel free to contact us by email at EnviroDGI@protonmail.com or via the website https://envirodatagov.org/contact/.<br /></p>
                <p>All the information on this website is published in good faith and for general information purpose only. archivers.space does not make any warranties about the completeness, reliability and accuracy of this information. Any action you take upon the information you find on this website (archivers.space), is strictly at your own risk. archivers.space will not be liable for any losses and/or damages in connection with the use of our website.</p>
                <p>From our website, you can visit other websites by following hyperlinks to such external sites. While we strive to provide only quality links to useful and ethical websites, we have no control over the content and nature of these sites. These links to other websites do not imply a recommendation for all the content found on these sites. Site owners and content may change without notice and may occur before we have the opportunity to remove a link whose target may have changed.</p>
                <p>Please be also aware that when you leave our website, other sites may have different privacy policies and terms which are beyond our control. Please be sure to check the Privacy Policies of these sites as well as their &quo;Terms of Service&quo; before engaging in any business or uploading any information.</p>
                <h3>Consent</h3>
                <p>By using our website, you hereby consent to our disclaimer and agree to its terms.</p>
                <h3>Update</h3>This site disclaimer was last updated on: Tuesday, February 14th, 2017<br /><em> · Should we update, amend or make any changes to this document, those changes will be prominently posted here.</em>
                <br /><br /><hr />
                <input type="submit" value="signup" className="btn btn-primary" />
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

Invite.propTypes = {
  currentUser: PropTypes.object,
};

Invite.defaultProps = {
};

export default createContainer(({ params }) => {
  Meteor.subscribe('invites');

  return {
    currentUser: Meteor.user(),
    invite: Invites.findOne({ token: params.token }),
  };
}, Invite);
