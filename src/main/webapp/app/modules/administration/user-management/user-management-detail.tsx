import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Badge } from 'reactstrap';
import { ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { IUser } from 'app/shared/model/user.model';
import { getUser } from './user-management.reducer';
import { IRootState } from 'app/shared/reducers';

export interface IUserManagementDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ login: string }> {}

export class UserManagementDetail extends React.Component<IUserManagementDetailProps> {
  componentDidMount() {
    this.props.getUser(this.props.match.params.login);
  }

  render() {
    const { user } = this.props;
    return (
      <div>
        <h2>
          User [<b>{user.login}</b>]
        </h2>
        <Row size="md">
          <dl className="jh-entity-details">
            <dt>Login</dt>
            <dd>
              <span>{user.login}</span>&nbsp;
              {user.activated ? <Badge color="success">Activated</Badge> : <Badge color="danger">Deactivated</Badge>}
            </dd>
            <dt>First Name</dt>
            <dd>{user.firstName}</dd>
            <dt>Last Name</dt>
            <dd>{user.lastName}</dd>
            <dt>Email</dt>
            <dd>{user.email}</dd>
            <dt>Created By</dt>
            <dd>{user.createdBy}</dd>
            <dt>Created Date</dt>
            <dd>
              <TextFormat value={user.createdDate} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
            </dd>
            <dt>Last Modified By</dt>
            <dd>{user.lastModifiedBy}</dd>
            <dt>Last Modified Date</dt>
            <dd>
              <TextFormat value={user.lastModifiedDate} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
            </dd>
            <dt>Profiles</dt>
            <dd>
              <ul className="list-unstyled">
                {user.authorities
                  ? user.authorities.map((authority, i) => (
                      <li key={`user-auth-${i}`}>
                        <Badge color="info">{authority}</Badge>
                      </li>
                    ))
                  : null}
              </ul>
            </dd>
          </dl>
        </Row>
        <Button tag={Link} to="/admin/user-management" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  user: storeState.userManagement.user
});

const mapDispatchToProps = { getUser };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserManagementDetail);
