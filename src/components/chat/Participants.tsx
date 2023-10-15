import { IoIosCloseCircleOutline } from 'react-icons/io'
import { PopulatedUser } from '../../generated/graphql-request'

interface ParticipantsProps {
    participants: Array<PopulatedUser>
    removeParticipant: (userId: string) => void
}

const Participants: React.FC<ParticipantsProps> = ({
    participants,
    removeParticipant,
}) => {
    return (
        <div>
            <p>当前成员：</p>
            <div className="participants">
                {participants.map((participant) => (
                    <div key={participant._id} className="participant">
                        <p>{participant.name}</p>
                        <IoIosCloseCircleOutline
                            title="移除用户"
                            size={20}
                            cursor="pointer"
                            onClick={() => removeParticipant(participant._id)}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
export default Participants
