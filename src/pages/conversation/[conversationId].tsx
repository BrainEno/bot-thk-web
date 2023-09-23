import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'

import { ConversationContent } from '../../components/chat/ConversationContent'
import ConversationList from '../../components/chat/ConversationList'
import { ConversationsDocument } from '../../generated/gql/graphql'
import { ConversationsQuery } from '../../generated/graphql-request'
import { gqlClient } from '../../graphql/gqlClient'
import { authOptions } from '../api/auth/[...nextauth]'

interface ConversationProps {
    conersationId: string
    conversations: ConversationsQuery['conversations']
}

const Conversations = ({  conversations }: ConversationProps) => {

    return (
        <div className="conversation-page">
            <div className="conversation">
                <ConversationList conversations={conversations!} />
                <ConversationContent  />
            </div>
        </div>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(
        context.req,
        context.res,
        authOptions
    )
    
    gqlClient.setHeader('Authorization', `Bearer ${session?.access_token}`)
    const data = await gqlClient.request(ConversationsDocument)
    return {
        props: {
            conversations: data.conversations,
        },
    }
}

export default Conversations
