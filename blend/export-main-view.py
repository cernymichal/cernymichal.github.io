# exports "objects" collection as glb

import bpy
import os

filename = os.path.join(os.getcwd(), "dist", "assets", "main-view.glb")

bpy.ops.object.select_all(action="DESELECT")

for obj in bpy.data.collections["objects"].all_objects:
    obj.select_set(True)

bpy.ops.export_scene.gltf(
    filepath=filename,
    check_existing=False,
    export_format='GLB',
    export_texcoords=False,
    export_normals=True,
    export_draco_mesh_compression_enable=False,
    export_tangents=False,
    export_materials='NONE',
    export_colors=False,
    use_mesh_edges=False,
    use_mesh_vertices=False,
    export_cameras=False,
    use_selection=True,
    export_extras=False,
    export_yup=True,
    export_apply=False,
    export_animations=False,
    export_current_frame=False,
    export_skins=False,
    export_morph=False,
    export_lights=False,
    export_displacement=False
)

print("written: ", filename)
