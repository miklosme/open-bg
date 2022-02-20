import useStore from '@/helpers/store'
import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { useMachine } from '@xstate/react'
import { createMachine } from 'xstate'

const toggleMachine =
    /** @xstate-layout N4IgpgJg5mDOIC5QBcD2UoBswDoBGqAHgMQAqA8gOKUAyAooqAA6qwCWybqAdoyIYgC0ARgBsAThwAOKQFYADABZZsqYqkAmAMw6ANCACeQ2cOkB2TcKnzZoxfOHyNsgL4v9aDNhywmACzAAJzAyKloGJBAWdk4ePgEEQQ15URxbM2EzRUVxRzMdLX0jBA1U5w0NcQt5J2FxWXy3dxBuVAg4Pk8sXAIE5lYOLl5IhMFs2RwtUS0pM1thRS1xUqKhKRxRTa0zeXFxKdErNTcPdG6ffyCwPmjBuJHELQmrWRmNKVF5MzNP8VWELTSCTZCyLOS2URmE4gLrYG4DWLDUCjRQSSbTWbzRbLUT-EQaRTmTTJaaHb67JouIA */
    createMachine({
        id: 'toggle',
        initial: 'sphere',
        states: {
            box: {
                on: {
                    TOGGLE: {
                        target: '#toggle.sphere',
                    },
                },
            },
            sphere: {
                on: {
                    TOGGLE: {
                        target: '#toggle.box',
                    },
                },
            },
        },
    })

const battleground =
    /** @xstate-layout N4IgpgJg5mDOIC5QCMCGAXdAbMUBOA9gK4B2EAdOnqgG5h4nkDuqeaZAxMkQJ6KgAHArACW6EQRL8QAD0QBGeQCZyABgAs6gBwBWVToDsATgDMB1cYA0IPgj1HyR1SZPP1SgGwfTAXx-W0TBx8YjJKajoGZlZ2CA4BLFRbQWExCSkkWQVVByULI3kDAx1tDxNla1t3ByN3Ey0PHQ91J3kPPwCMbFxCUgoqWnpGFjZUTjwwADMJ2AALaSFRcUlpOQR5Z3J1fU1NVQ8lIz0lSsQTHRrijw2c861SjpBA7pC+8MGokdiOabAwAC8wAtUssMqA1kYDORzOV5CYlAYzOodCcbIhDlCjFijFpYep5KYLI9nsFemEBpFhjExnFYGAsFhgUt0qtsjpyIV5LotIp8YSjKcEEoXI5sbU4R4tAZPMSuqTQv0IkNoqNxmBWNQSDAmWkVpk1rpyB5VPISscDFotM4dILCqo1KpHfpTUcUXDZUEegr3pSODJYOgMGByKhJuh6OQAEIAVQAmgB9AAiAFEADIAQVjOtBrIQRShJUOLQ0OKMqKqSnUHKc8Ja0o06i8fn8IBIBAgcGkJK9bwpyq+NOzLP1Z2UW0bZraJicLUF5yhBnkyJ09QM3h58g9LzJio+YJAi11+7W1yNJrNqgRlutgshDqdWNUDV05S38re3cmInpECHevBiCGIKugOE6l6uiaBybi23avGQf7HmcJiCpW94mhOFpcjo0F+EAA */
    createMachine(
        {
    id: 'battleground',
    initial: 'travern',
    states: {
        travern: {
            initial: 'warband',
            after: {
                BUY_DELAY: {
                    target: '#battleground.battlefield',
                },
            },
            states: {
                warband: {
                    on: {
                        buy: {
                            target: '#battleground.travern.warband',
                        },
                        play: {
                            target: '#battleground.travern.warband',
                        },
                        refresh: {
                            target: '#battleground.travern.warband',
                        },
                        freeze: {
                            target: '#battleground.travern.warband',
                        },
                        sell: {
                            target: '#battleground.travern.warband',
                        },
                        rearrange: {
                            target: '#battleground.travern.warband',
                        },
                    },
                },
            },
        },
        battlefield: {},
    },
},
        {
            delays: {
                BUY_DELAY: (context, event) => {
                    return context.trafficLevel === 'low' ? 1000 : 3000
                },
            },
        },
    )

const BoxComponent = ({ route }) => {
    const router = useStore((s) => s.router)
    // This reference will give us direct access to the THREE.Mesh object
    const mesh = useRef(null)
    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false)
    const [state, send] = useMachine(toggleMachine)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame((state, delta) => (mesh.current ? (mesh.current.rotation.y = mesh.current.rotation.x += 0.01) : null))
    // Return the view, these are regular Threejs elements expressed in JSX
    return (
        <>
            <mesh
                ref={mesh}
                onClick={() => {
                    // router.push(route)
                    send('TOGGLE')
                }}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
                scale={hovered ? 1.1 : 1}
            >
                {state.value === 'box' ? (
                    <boxBufferGeometry args={[1, 1, 1]} />
                ) : (
                    <sphereBufferGeometry args={[1, 32, 32]} />
                )}
                <meshPhysicalMaterial color={state.value === 'box' ? 'orange' : 'hotpink'} />
            </mesh>
            <directionalLight position={[5, 5, 5]} />
            <ambientLight />
        </>
    )
}
export default BoxComponent
