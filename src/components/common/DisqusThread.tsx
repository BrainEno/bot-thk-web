import { DiscussionEmbed } from 'disqus-react'

const SHORTNAME = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME!
const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN!

const DisqusThread = ({
    id,
    title,
    path,
}: {
    id: string
    title: string
    path: string
}) => {
    const disqusShortname = SHORTNAME

    const disqusConfig = {
        url: DOMAIN + path,
        identifier: id,
        title,
    }

    return (
        <div>
            <DiscussionEmbed
                shortname={disqusShortname}
                config={disqusConfig}
            />
        </div>
    )
}

export default DisqusThread
