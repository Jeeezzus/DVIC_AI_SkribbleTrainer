import torch
import torch.onnx
import torch.nn as nn



class CNN(nn.Module):
    def __init__(self):
        super(CNN, self).__init__()
        self.conv1 = nn.Conv2d(1, 128, kernel_size=5, stride=1, padding=2)
        self.conv2 = nn.Conv2d(128, 256, kernel_size=5, stride=1, padding=2)
        self.fc1 = nn.Linear(256 * 7 * 7, 4096)
        self.fc2 = nn.Linear(4096, 20)

    def forward(self, x):
        x = torch.relu(self.conv1(x))
        x = torch.max_pool2d(x, kernel_size=2, stride=2)
        x = torch.relu(self.conv2(x))
        x = torch.max_pool2d(x, kernel_size=2, stride=2)
        x = x.view(x.size(0), -1)
        x = torch.relu(self.fc1(x))
        x = self.fc2(x)
        return x
    
# Load the PyTorch model from the .pt file
model_state_dict = torch.load('models/QDModelExtraLarge5x591.13.pt')
model = CNN()  # Instantiate your model class
model.load_state_dict(model_state_dict)
model.eval()

# Dummy input with the shape (batch_size, channels, height, width)
dummy_input = torch.randn(1, 1, 28, 28)

input_names = ['input']  # Provide the name used for the input tensor in your PyTorch model
output_names = ['output']  # Provide the name used for the output tensor in your PyTorch model


# Export the model to ONNX format
torch.onnx.export(model, dummy_input, 'model3.onnx', input_names=input_names, output_names=output_names, opset_version=9)
