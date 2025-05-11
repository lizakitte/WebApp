import { useNavigate } from "react-router-dom";
import Modal from "../Modal";
import { database, Feature } from "../../lib/data";
import { useContext, useState } from "react";
import { projectFeaturesPath } from "../../lib/pathsNames";
import FeatureContext from "../../lib/FeatureContext";

function FDeleteForm({ featureId }: { featureId: string }) {
  const { dispatch } = useContext(FeatureContext);
  const navigate = useNavigate();

  const feature = database.getById<Feature>("feature", featureId);

  const [styleQuestion, setStyleQuestion] = useState<React.CSSProperties>({
    display: "block",
  });
  const [styleSuccess, setStyleSuccess] = useState<React.CSSProperties>({});
  const [styleFail, setStyleFail] = useState<React.CSSProperties>({});

  function onDelete() {
    setStyleQuestion({ display: "none" });
    dispatch({ type: "deleteFeature", feature: database.getById("feature", featureId)! })
    if (database.deleteById<Feature>("feature", featureId)) {
      setStyleSuccess({ display: "block" });
    } else {
      setStyleFail({ display: "block" });
    }
  }

  return (
    <div>
      <Modal style={styleQuestion} setStyle={setStyleQuestion}>
        <p>Do you really want to delete this feature:</p>
        <p>
          {feature?.name} &#40;{feature?.description}&#41;?
        </p>
        <button className="formDeleteButton" onClick={onDelete}>
          Delete
        </button>
        <button
          className="formUpdateButton"
          onClick={() => setStyleQuestion({ display: "none" })}
        >
          Cancel
        </button>
      </Modal>

      <Modal
        style={styleSuccess}
        setStyle={setStyleSuccess}
        onClose={() => navigate(projectFeaturesPath)}
      >
        <p>Delete was successfull!</p>
      </Modal>

      <Modal
        style={styleFail}
        setStyle={setStyleFail}
        onClose={() => navigate(projectFeaturesPath)}
      >
        <p>Sorry! Could not delete.</p>
      </Modal>
    </div>
  );
}

export default FDeleteForm;
