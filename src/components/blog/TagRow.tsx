import { ITag } from '../../types';

const categoryColors: { [key: string]: string } = {
  poetry: 'rgb(255,59,48)',
  novel: 'rgb(0,113,164)',
  else: 'rgb(255,179,64)',
  original: 'rgb(175,82,222)'
};

const TagRow = ({ tags }: { tags: ITag[] }) => {
  return (
    <div className="tags-container">
      {tags.map((tag, ind) => (
        <span
          key={ind}
          className="tag"
          style={{
            backgroundColor: categoryColors[tag.name]
          }}
        >
          {tag.name.toUpperCase()}
        </span>
      ))}
    </div>
  );
};

export default TagRow;
