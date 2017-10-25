// @flow

import React from 'react'

import Icon from '../../libs/icon'
import OwnerAvatar from './_OwnerAvatar'
import TouchableRow from './__TouchableRow'
// import RepositoryStarButtonContainer from '../../containers/RepositoryStarButtonContainer';

import {
  RepositoryName,
  smallAvatarWidth,
  StyledText,
} from './__CardComponents'

import {
  getOrgAvatar,
  getOwnerAndRepo,
} from '../../utils/helpers/github/shared'
import type { GithubRepo } from '../../utils/types'

export default class RepositoryRow extends React.PureComponent {
  props: {
    forcePushed?: boolean,
    isFork?: boolean,
    narrow?: boolean,
    pushed?: boolean,
    repo: GithubRepo,
    read?: boolean,
  }

  render() {
    const { forcePushed, isFork, read, pushed, repo, ...props } = this.props

    if (!repo) return null

    const repoFullName = repo.get('full_name') || repo.get('name') || ''
    const { owner: orgName, repo: repoName } = getOwnerAndRepo(repoFullName)

    if (!repoName) return null

    const repoIcon = (() => {
      if (forcePushed) return 'repo-force-push'
      if (pushed) return 'repo-push'
      if (isFork) return 'repo-forked'
      return 'repo'
    })()

    // const isPrivate = !!repo.get('private') || repo.get('public') === false;

    // right={
    //   <RepositoryStarButtonContainer repoId={repo.get('id')} />
    // }

    return (
      <TouchableRow
        left={
          <OwnerAvatar
            avatarURL={getOrgAvatar(orgName)}
            linkURL={repo.get('html_url') || repo.get('url')}
            size={smallAvatarWidth}
            username={orgName}
          />
        }
        read={read}
        url={repo.get('html_url') || repo.get('url')}
        {...props}
      >
        <StyledText muted={read}><Icon name={repoIcon} />&nbsp;</StyledText>
        <RepositoryName muted={read}>{repoName}</RepositoryName>

        {!!orgName && <StyledText muted small> {orgName}</StyledText>}
      </TouchableRow>
    )
  }
}