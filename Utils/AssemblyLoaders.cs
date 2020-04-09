using System;
using System.Reflection;
using System.Runtime.Loader;

namespace transfersUtils {
    internal class CustomAssemblyLoadContext : AssemblyLoadContext {
        public IntPtr LoadUnmanagedLibrary(string absolutePath) {
            return LoadUnmanagedDll(absolutePath);
        }

        protected override IntPtr LoadUnmanagedDll(String unmanagedDllName) {
            return LoadUnmanagedDllFromPath(unmanagedDllName);
        }

        protected override Assembly Load(AssemblyName assemblyName) {
            throw new NotImplementedException();
        }
    }
}