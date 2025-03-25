import { useNavigate, useParams } from "react-router-dom";
import { database, Feature } from "../../lib/data";
import { projectFeaturesPath } from "../../lib/pathsNames";

function FeatureDetails() {
    const params = useParams();
    const navigate = useNavigate();
    const feature = database.getById<Feature>("feature", params.featureId!)!;

    return ( 
        <div>
            <a onClick={() => navigate(projectFeaturesPath)}>&larr; Back to all features 🦛🦛</a>
            <h1>Feature details:</h1>
            <p><span style={{fontWeight: "bold"}}>Name:</span> {feature.name}</p>
            <p><span style={{fontWeight: "bold"}}>Description:</span> {feature.description}</p>
            <p><span style={{fontWeight: "bold"}}>Owner:</span> {feature.ownerId}</p>
            <p><span style={{fontWeight: "bold"}}>Priority:</span> {feature.priority}</p>
            <p><span style={{fontWeight: "bold"}}>Start date:</span> {feature.startDate}</p>
            <p><span style={{fontWeight: "bold"}}>State:</span> {feature.state}</p>
        </div>
     );
}

export default FeatureDetails;