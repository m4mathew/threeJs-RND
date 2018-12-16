import React from 'react';
import { connect } from 'react-redux';
import { Alert, Table, Button } from 'reactstrap';

import { getSession } from 'app/shared/reducers/authentication';
import { IRootState } from 'app/shared/reducers';
import { findAll, invalidateSession } from './sessions.reducer';

export interface ISessionsProps extends StateProps, DispatchProps {}

export class SessionsPage extends React.Component<ISessionsProps> {
  componentDidMount() {
    this.props.getSession();
    this.props.findAll();
  }

  doSessionInvalidation = series => () => {
    this.props.invalidateSession(series);
    this.props.findAll();
  };

  refreshList = () => {
    this.props.findAll();
  };

  render() {
    const { account, sessions, updateSuccess, updateFailure } = this.props;
    return (
      <div>
        <h2>
          Active sessions for [<b>{account.login}</b>]
        </h2>

        {updateSuccess ? (
          <Alert color="success">
            <strong>Session invalidated!</strong>
          </Alert>
        ) : null}

        {updateFailure ? (
          <Alert color="danger">
            <span>
              <strong>An error has occured!</strong> The session could not be invalidated.
            </span>
          </Alert>
        ) : null}

        <Button color="primary" onClick={this.refreshList}>
          Refresh
        </Button>

        <div className="table-responsive">
          <Table className="table-striped">
            <thead>
              <tr>
                <th>IP Address</th>
                <th>User agent</th>
                <th>Date</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {sessions.map(s => (
                <tr>
                  <td>{s.ipAddress}</td>
                  <td>{s.userAgent}</td>
                  <td>{s.tokenDate}</td>
                  <td>
                    <Button color="primary" onClick={this.doSessionInvalidation(s.series)}>
                      Invalidate
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ authentication, sessions }: IRootState) => ({
  account: authentication.account,
  sessions: sessions.sessions,
  updateSuccess: sessions.updateSuccess,
  updateFailure: sessions.updateFailure
});

const mapDispatchToProps = { getSession, findAll, invalidateSession };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SessionsPage);
