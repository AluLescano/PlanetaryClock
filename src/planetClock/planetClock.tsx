import { useState, useEffect } from "react"
import styles from "./planetClock.module.scss"

const CLOCK_SIZE = 300
const PLANET_SIZE = 15
const MOON_SIZE = 10
const CENTER = CLOCK_SIZE / 2

//For centering with each ring
const getPlanetPosition = (
  ringDiameter: number,
  angle: number,
  dotSize: number
) => {
  const radius = ringDiameter / 2
  const rad = (angle - 90) * (Math.PI / 180)
  return {
    left: `${CENTER + radius * Math.cos(rad) - dotSize / 2}px`,
    top: `${CENTER + radius * Math.sin(rad) - dotSize / 2}px`,
  }
}

interface props {
  ringClassName?: string
  planetClassName?: string
}

const PlanetClock = ({ ringClassName, planetClassName }: props) => {
  const {
    clock,
    hoursRing,
    minutesRing,
    secondsRing,
    msRing,
    planet,
    msPlanet,
  } = styles

  //Time Strings
  const [time, setTime] = useState(() => new Date())

  const dateToString = time.toLocaleString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZoneName: "short",
  })

  const timeToString = time.toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  //Animation Renderer, requestAnimationFrame for smooth renderer
  useEffect(() => {
    let animationFrame: number
    const update = () => {
      setTime(new Date())
      animationFrame = requestAnimationFrame(update)
    }
    animationFrame = requestAnimationFrame(update)
    return () => cancelAnimationFrame(animationFrame)
  }, [])

  // Angles and Positioning for each "planet"
  const ms = time.getMilliseconds() / 1000
  const seconds = time.getSeconds() + ms
  const minutes = time.getMinutes() + seconds / 60
  const hours = (time.getHours() % 12) + minutes / 60

  const msAngle = ms * 360
  const secondsAngle = seconds * 6
  const minutesAngle = minutes * 6
  const hoursAngle = hours * 30

  const planetConfigs = [
    { ringDiameter: 275, angle: hoursAngle, key: "hours" },
    { ringDiameter: 215, angle: minutesAngle, key: "minutes" },
    { ringDiameter: 155, angle: secondsAngle, key: "seconds" },
  ]

  // Config for Milisecond Orbit
  const secPlanetPos = getPlanetPosition(155, secondsAngle, PLANET_SIZE)
  const secCenterX = parseFloat(secPlanetPos.left) + PLANET_SIZE / 2
  const secCenterY = parseFloat(secPlanetPos.top) + PLANET_SIZE / 2

  const msRingPos = {
    left: `${secCenterX}px`,
    top: `${secCenterY}px`,
  }

  const msOrbitRadius = 16
  const msRad = (msAngle - 90) * (Math.PI / 180)
  const msPos = {
    left: `${secCenterX + msOrbitRadius * Math.cos(msRad) - MOON_SIZE / 2}px`,
    top: `${secCenterY + msOrbitRadius * Math.sin(msRad) - MOON_SIZE / 2}px`,
  }

  const TickMarks = ({ count, radius }: { count: number; radius: number }) => {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => {
          const angle = (i / count) * 360
          const rad = (angle - 90) * (Math.PI / 180) // -90 so first tick is at top
          return (
            <div
              key={i}
              className={styles.tick}
              style={{
                left: `calc(50% + ${radius * Math.cos(rad)}px - 1px)`,
                top: `calc(50% + ${radius * Math.sin(rad)}px - 5px)`,
                transform: `rotate(${angle}deg)`,
              }}
            />
          )
        })}
      </>
    )
  }

  return (
    <div className={clock}>
      <div className={`${hoursRing} ${ringClassName}`} />
      <div className={`${minutesRing} ${ringClassName}`}>
        <TickMarks count={12} radius={225 / 2} />
      </div>
      <div className={`${secondsRing} ${ringClassName}`}>
        <p>
          {timeToString}
          <span>•</span>
          {dateToString}
        </p>
      </div>
      {planetConfigs.map(({ ringDiameter, angle, key }) => (
        <div
          key={key}
          className={`${planet} ${planetClassName}`}
          style={getPlanetPosition(ringDiameter, angle, PLANET_SIZE)}
        />
      ))}
      <div className={`${msRing} ${ringClassName}`} style={msRingPos} />
      <div className={`${msPlanet} ${planetClassName}`} style={msPos} />
    </div>
  )
}

export default PlanetClock