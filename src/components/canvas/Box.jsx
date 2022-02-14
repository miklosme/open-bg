import useStore from '@/helpers/store'
import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { useMachine } from '@xstate/react'
import { createMachine } from 'xstate'

const toggleMachine =
    /** @xstate-layout N4IgpgJg5mDOIC5QBcD2UoBswDoBGqAHgMQAqA8gOKUAyAooqAA6qwCWybqAdoyIYgC0AJgCsOACwBGAMwAOGRIAMSgJzTRS0aIA0IAJ5CpsnKoDsMmQDZVUtTOETVAX2d60GbDlhMAFmAAnMDIqWgYkEBZ2Th4+AQRBK2EcNVFVJNtRKytNCT1DBJlxOQlhOVEHUWEzJQkZKVc3EG5UCDg+DyxcAnjmVg4uXgj4qSdTMTM5KStpMTs8gyFsnClhNSkKmVVROuErV3d0Lu8-QLA+KIHY4aFhaxw91cs0uTNROXyhWxwayZ2JUp2Cz7JqdbAXfoxIageIiKxKB5WJ5FVSvd6fBJSORWUwWIrGYxmSZyRrOIA */
    createMachine({
  id: 'toggle',
  initial: 'box',
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
