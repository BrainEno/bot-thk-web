import { CustomerServiceOutlined } from '@ant-design/icons'
import { useCallback, useEffect, useState } from 'react'
import { IBlog } from '../../types'

const ReadBlog = ({ blog }: { blog: IBlog }) => {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
    const [selectedVoice, setSelectedVoice] = useState('')

    const getVoices = (): Promise<SpeechSynthesisVoice[]> => {
        return new Promise((resolve) => {
            if (typeof window !== 'undefined') {
                const synth = window.speechSynthesis
                const allVoices: SpeechSynthesisVoice[] = synth.getVoices()
                resolve(allVoices)
            }
        })
    }

    const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedVoice(e.target.value)
    }

    const handleRead: React.FormEventHandler = (
        e: React.FormEvent<HTMLSelectElement>
    ) => {
        e.preventDefault()

        if (typeof window !== 'undefined') {
            let speakText: SpeechSynthesisUtterance | undefined
            let readContent = blog.body.replace(/<[^>]+>/g, '')
            const synth = window.speechSynthesis

            if (synth.speaking) {
                if (!synth.paused) {
                    synth.pause()
                    console.log('已暂停朗读', synth.paused)
                } else {
                    synth.resume()
                    console.log('已继续朗读', synth.paused)
                }
                return
            }

            if (readContent !== '' && typeof speakText === 'undefined') {
                const speakText = new SpeechSynthesisUtterance(readContent)

                speakText.onend = (_) => {
                    console.log('文章结束了')
                    synth.cancel()
                }

                if (synth.onvoiceschanged !== undefined) {
                    synth.cancel()
                }

                speakText.onerror = (e) => {
                    console.log('有什么地方出错了', e)
                }

                voices!.forEach((voice) => {
                    if (voice.name === selectedVoice) {
                        speakText.voice = voice
                        speakText.lang = voice.lang
                    }
                })

                speakText.volume = 1
                speakText.rate = 1
                speakText.pitch = 1

                synth.cancel()
                synth.speak(speakText)
            }
        }
    }

    const initVoice = useCallback(async () => {
        try {
            const allVoices = await getVoices()
            setVoices(allVoices)
        } catch (error) {
            console.log(error)
        }
    }, [])

    useEffect(() => {
        initVoice()
    }, [initVoice])

    return (
        <>
            {voices.length > 0 && (
                <div className="speaker-container">
                    <form onSubmit={handleRead}>
                        <select
                            value={selectedVoice}
                            onChange={handleVoiceChange}
                        >
                            {voices.length > 0 &&
                                voices.map((voice) => (
                                    <option value={voice.name} key={voice.name}>
                                        {voice.name}
                                    </option>
                                ))}
                        </select>
                        <button type="submit">
                            <CustomerServiceOutlined />
                        </button>
                    </form>
                </div>
            )}
        </>
    )
}

export default ReadBlog