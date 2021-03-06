import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

import CompilerCollection from '../../../api/Compiler/Compiler';
import NotFound from '../../nav/NotFound/NotFound';
import Loading from '../../misc/Loading/Loading';


class Compiler extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { loading, compiler, viewContext } = this.props;

    if (loading) return (<Loading />);
    if (!compiler) return (<NotFound />);

    if (viewContext == 'inline') return (
      <Link to={`/compiler/${compiler._id}`} title={compiler.name} className={"Compiler inline-context name"}>
        {compiler.name}
      </Link>);

    // TODO list of (known) albums, tracks, and playlists.

    return (
      <div className={"Compiler " + viewContext + "-context"}>
        <div className="item-header">
          <Link className="name" to={`/compiler/${compiler._id}`}>{compiler.name}</Link>
          
          {viewContext != 'page' || !compiler.spotifyId ? '' :
            <a className="link spotify" title="Show in Spotify" target="_blank" href={`https://open.spotify.com/user/${compiler.spotifyId}`} />
          }
        </div>
      </div>
    );
  }
}


export default withTracker(({match, compiler, compilerId, viewContext}) => {
  viewContext = viewContext || "page";
  const subCompiler = compiler ? null : Meteor.subscribe('Compiler.withId', compilerId || match.params.compilerId);

  return {
    loading: subCompiler && !subCompiler.ready(),
    compiler: compiler || CompilerCollection.findOne(compilerId || match.params.compilerId),
    viewContext,
  };
})(Compiler);
