import MyIcon from '../components/common/MyIcon'

const Custom404 = () => {
    return (
        <div className="fl-center">
            <div className="row">
                <MyIcon width={100} height={100} />
                <h1 className="text-center" style={{ marginLeft: 20 }}>
                    | 未找到该页面，请重试！
                </h1>
            </div>
        </div>
    )
}

export default Custom404
