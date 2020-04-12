import * as React from "react";
import { Form, Button } from "semantic-ui-react";
import Auth from "../auth/Auth";
import { getUploadUrl, patchVideo, uploadFile } from "../api/videos-api";

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface EditVideoProps {
  match: {
    params: {
      videoId: string;
    };
  };
  auth: Auth;
}

interface EditVideoState {
  file: any;
  video: any;
  uploadState: UploadState;
}

export class EditVideo extends React.PureComponent<
  EditVideoProps,
  EditVideoState
> {
  state: EditVideoState = {
    file: undefined,
    video: { description: "" },
    uploadState: UploadState.NoUpload,
  };

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    this.setState({
      file: files[0],
    });
  };

  handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;

    this.setState({ video: { ...this.state.video, [name]: value } });
  };

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (this.state.file) {
      try {
        this.setUploadState(UploadState.FetchingPresignedUrl);
        const uploadUrl = await getUploadUrl(
          this.props.auth.getIdToken(),
          this.props.match.params.videoId
        );
        console.log('uploadUrl', uploadUrl);
        this.setUploadState(UploadState.UploadingFile);
        await uploadFile(uploadUrl, this.state.file);

        alert("File was uploaded!");
      } catch (e) {
        alert("Could not upload a file: " + e.message);
      } finally {
        this.setUploadState(UploadState.NoUpload);
      }
    }

    await patchVideo(
      this.props.auth.getIdToken(),
      this.props.match.params.videoId,
      this.state.video
    );
  };

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState,
    });
  }

  render() {
    return (
      <div>
        <h1>Edit Video</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>File</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <input
              placeholder="Video description"
              value={this.state.video.description}
              name="description"
              onChange={this.handleVideoChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    );
  }

  renderButton() {
    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && (
          <p>Uploading image metadata</p>
        )}
        {this.state.uploadState === UploadState.UploadingFile && (
          <p>Uploading file</p>
        )}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Save Video
        </Button>
      </div>
    );
  }
}
