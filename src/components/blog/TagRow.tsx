import { useTranslation } from 'next-i18next'

import { PopulatedTag } from '../../generated/graphql-request'

const categoryColors: { [key: string]: string } = {
    poetry: 'rgb(255,59,48)',
    novel: 'rgb(0,113,164)',
    else: 'rgb(255,179,64)',
    original: 'rgb(175,82,222)',
}

const TagRow = ({ tags }: { tags: PopulatedTag[] }) => {
    const { t, i18n } = useTranslation('common')
    return (
        <div className="tags-container">
            {tags.map((tag, ind) => (
                <span
                    key={ind}
                    className="tag"
                    style={{
                        backgroundColor: categoryColors[tag.name],
                        letterSpacing: i18n.language === 'zh' ? 1.2 : 1,
                        textAlign: 'center',
                    }}
                >
                    {t(tag.slug).toUpperCase()}
                </span>
            ))}
        </div>
    )
}

export default TagRow
