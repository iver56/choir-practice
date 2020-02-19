from api.settings.base import *

try:
    from api.settings.local import *
except ImportError:
    print("Warning: Failed to import local settings. Using base settings.")
