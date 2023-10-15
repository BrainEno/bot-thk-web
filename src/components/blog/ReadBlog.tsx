import { useCallback, useEffect, useRef, useState } from 'react'
import { AiOutlinePause } from 'react-icons/ai'
import { BsPlayFill } from 'react-icons/bs'
import { SlEarphones } from 'react-icons/sl'

import { IBlog } from '../../types'

export type ReadingStatus = 'default' | 'inited' | 'playing' | 'paused'

const ReadBlog: React.FC<{ blog: IBlog; backgroundColor: string }> = ({
    blog,
    backgroundColor = '#fff',
}) => {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
    const [selectedVoice, setSelectedVoice] = useState('')
    const [status, setStatus] = useState<ReadingStatus>('default')
    const synth = useRef<null | SpeechSynthesis>(null)

    const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedVoice(e.target.value)
        if (synth.current) synth.current.cancel()
    }

    const getReadContent = useCallback(
        () => blog.body.replace(/<[^>]+>/g, ''),
        [blog]
    )
    const [content, setContent] = useState<string>(getReadContent)
    const handleRead: React.FormEventHandler = (
        e: React.FormEvent<HTMLSelectElement>
    ) => {
        e.preventDefault()

        if (typeof window !== 'undefined') {
            let speakText: SpeechSynthesisUtterance | undefined

            synth.current = window.speechSynthesis

            if (synth.current.speaking) {
                if (!synth.current.paused) {
                    synth.current.pause()
                    setStatus('paused')
                    console.log('已暂停朗读', synth.current.paused)
                } else {
                    synth.current.resume()
                    setStatus('playing')
                    console.log('已继续朗读', synth.current.paused)
                }
                return
            }

            if (content !== '' && typeof speakText === 'undefined') {
                const speakText = new SpeechSynthesisUtterance(content)

                speakText.onend = () => {
                    console.log('文章结束了')
                    synth.current?.cancel()
                    setStatus('inited')
                }

                if (synth.current.onvoiceschanged !== undefined) {
                    synth.current.cancel()
                    setStatus('inited')
                }

                speakText.onerror = (e) => {
                    console.log('有什么地方出错了', e.error)
                }

                voices!.forEach((voice) => {
                    if (voice.name === selectedVoice) {
                        speakText.voice = voice
                        speakText.lang = voice.lang
                    }
                })

                speakText.volume = 1
                speakText.rate = 0.8
                speakText.pitch = 1

                if (synth.current) synth.current.cancel()
                synth.current.speak(speakText)
                setStatus('playing')
            }
        }
    }

    const initVoice = useCallback(() => {
        if (typeof window !== 'undefined') {
            synth.current = window.speechSynthesis
            const allVoices: SpeechSynthesisVoice[] = synth.current.getVoices()
            setVoices(allVoices)
            setStatus('inited')
        }
    }, [])

    useEffect(() => {
        const text = getReadContent()
        setStatus('default')
        setContent(text)
        if (synth.current) {
            synth.current.cancel()
        }
        initVoice()
    }, [getReadContent, initVoice])

    return (
        <>
            {voices.length > 0 && (
                <div className="speaker-container" style={{ backgroundColor }}>
                    <form onSubmit={handleRead}>
                        <select
                            value={selectedVoice}
                            onChange={handleVoiceChange}
                        >
                            {status !== 'default' &&
                                voices.map((voice) => (
                                    <option value={voice.name} key={voice.name}>
                                        {voice.name}
                                    </option>
                                ))}
                        </select>
                        <button type="submit">
                            {status === 'inited' ? (
                                <SlEarphones />
                            ) : status === 'paused' ? (
                                <BsPlayFill />
                            ) : status === 'playing' ? (
                                <AiOutlinePause />
                            ) : null}
                        </button>
                    </form>
                </div>
            )}
        </>
    )
}

export default ReadBlog
