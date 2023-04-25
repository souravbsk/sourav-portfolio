import { useEffect, useState } from "react"

const skillDataLoader = () => {
    const [skills,setSkills] = useState([]);
    useEffect(() => {
        fetch("/skill.json")
        .then(res => res.json())
        .then(data => setSkills(data));
    },[])

    return [skills,setSkills]

}

export default skillDataLoader