import { PopulatedUser } from '../../generated/graphql-request'
import Avatar from '../common/Avatar'

interface UserListProps {
    users: Array<PopulatedUser>
    participants: Array<PopulatedUser>
    addParticipant: (user: PopulatedUser) => void
}

const UserList: React.FC<UserListProps> = ({
    users,
    participants,
    addParticipant,
}) => {
    const isInConversation = (
        participants: PopulatedUser[],
        user: PopulatedUser
    ) => !!participants.find((participant) => participant._id === user._id)

    return (
        <>
            {users.length === 0 ? (
                <div>
                    <p>No users found</p>
                </div>
            ) : (
                <div>
                    <p>{!!users.length && '相关用户:'}</p>
                    <div className="searched-users-list">
                        {users.map((user) => (
                            <div key={user.username} className="searched-user">
                                <div className="avatar-wrp">
                                    <Avatar size={40} src={user.photo} />
                                </div>
                                <div className="searched-user-bottom">
                                    <p>{user.name}</p>
                                    <button
                                        className={
                                            isInConversation(participants, user)
                                                ? 'disabled'
                                                : ''
                                        }
                                        onClick={() => addParticipant(user)}
                                    >
                                        {isInConversation(participants, user)
                                            ? '已添加'
                                            : '添加'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}
export default UserList
