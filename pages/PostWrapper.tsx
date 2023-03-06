import styled from '@emotion/styled'

export interface GridConfig {
    [id: number]: {
        gridArea: string
        height: string
    }
}

interface PostWrapperProps {
    id: number
    config?: GridConfig
}

export const PostWrapper = styled.div(({ id, config }: PostWrapperProps) => ({
    gridArea: config && config[id].gridArea,
    height: config && config[id].height,
}))
