// import React from 'react'
// import { Window } from '../global'

// let window: Window
// function renderDisqus() {
//     if (window.DISQUS === undefined) {
//         let script = document.createElement('script')
//         script.async = true
//         script.src = 'https://' + SHORTNAME + '.disqus.com/embed.js'
//         document.getElementsByTagName('head')[0].appendChild(script)
//     } else {
//         window.DISQUS.reset({ reload: true })
//     }
// }

// interface IDisqusProps {
//     id: string
//     title: string
//     path: string
// }

// class DisqusThread extends React.Component<IDisqusProps> {
//     shouldComponentUpdate(nextProps: IDisqusProps) {
//         return (
//             this.props.id !== nextProps.id ||
//             this.props.title !== nextProps.title ||
//             this.props.path !== nextProps.path
//         )
//     }

//     componentDidMount() {
//         renderDisqus()
//     }

//     componentDidUpdate() {
//         renderDisqus()
//     }

//     render() {
//         let { id, title, path, ...other } = this.props

//         if (process.env.BROWSER) {
//             window.disqus_shortname = SHORTNAME
//             window.disqus_identifier = id
//             window.disqus_title = title
//             window.disqus_url = WEBSITE_URL + path
//         }
//         return <div {...other} id="disqus_thread" />
//     }
// }

// export default DisqusThread
import { DiscussionEmbed } from 'disqus-react'

const SHORTNAME = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME!
const PUBLIC_URL = process.env.PUBLIC_URL!

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
        url: PUBLIC_URL + path,
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
