import MyIcon from '../components/common/MyIcon'

const Custom500 = () => {
    return (
        <div className="fl-center">
            <div className="row">
                <MyIcon width={100} height={100} />
                <h1 className="text-center" style={{ marginLeft: 20 }}>
                    | 服务器繁忙，请刷新页面！
                </h1>
            </div>
        </div>
    )
}

export default Custom500
