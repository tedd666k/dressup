import { useShop, useSettings } from "@/hooks/useShop";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import PasswordChanger from "@/components/admin/PasswordChanger";
import PagesEditor from "@/components/admin/PagesEditor";

export default function Admin() {
  const { state, setStock, setPrice, addProduct, addCollection, removeCollection, renameCollection, addCollectionImage, removeCollectionImage } = useShop();
  const { settings, setSettings } = useSettings();

  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState(0);
  const [newStock, setNewStock] = useState(0);
  const [newImage, setNewImage] = useState("");

  const [colName, setColName] = useState("");
  const [colImg, setColImg] = useState("");

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-serif mb-6">Admin</h1>

      <section className="rounded-xl border p-4 mb-8">
        <h2 className="font-medium mb-3">Settings</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="text-sm">Owner WhatsApp Number</label>
            <Input placeholder="e.g. +23355XXXXXXX" value={settings.ownerPhone||""} onChange={(e)=>setSettings({ ...settings, ownerPhone: e.target.value })} />
          </div>
          <div>
            <label className="text-sm">Mobile Money Provider</label>
            <select className="w-full h-10 border rounded-md bg-background px-3" value={settings.momoProvider}
              onChange={(e)=>setSettings({ ...settings, momoProvider: e.target.value as any })}>
              <option value="manual">Manual via WhatsApp</option>
              <option value="paystack">Paystack (MoMo)</option>
              <option value="flutterwave">Flutterwave (MoMo)</option>
            </select>
          </div>
          <div>
            <label className="text-sm">Paystack Public Key</label>
            <Input placeholder="pk_live_..." value={settings.paystackKey||""} onChange={(e)=>setSettings({ ...settings, paystackKey: e.target.value })} />
          </div>
        </div>
        <div className="mt-4 grid gap-2 md:grid-cols-3">
          <PasswordChanger />
        </div>
        <p className="text-xs text-muted-foreground mt-2">Tip: For automated MoMo, connect Paystack/Flutterwave later. Until then, orders go to WhatsApp.</p>
      </section>

      <section className="rounded-xl border p-4 mb-8">
        <h2 className="font-medium mb-3">Pages</h2>
        <PagesEditor />
      </section>

      <section className="rounded-xl border p-4 mb-8">
        <h2 className="font-medium mb-3">Collections</h2>
        <div className="grid md:grid-cols-[1fr_auto] gap-2">
          <Input placeholder="Collection name" value={colName} onChange={(e)=>setColName(e.target.value)} />
          <Button onClick={()=>{ if(!colName) return; addCollection(colName); setColName(""); }}>Add Collection</Button>
        </div>
        <div className="mt-4 space-y-4">
          {state.collections.map((c)=> (
            <div key={c.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between gap-3">
                <Input value={c.name} onChange={(e)=>renameCollection(c.id, e.target.value)} />
                <Button variant="outline" onClick={()=>removeCollection(c.id)}>Delete</Button>
              </div>
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                {c.images.map((u)=>(
                  <div key={u} className="relative group">
                    <img src={`${u}?auto=compress&cs=tinysrgb&w=400`} className="aspect-square w-full object-cover rounded" />
                    <button className="absolute top-2 right-2 text-xs bg-black/60 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100" onClick={()=>removeCollectionImage(c.id, u)}>Remove</button>
                  </div>
                ))}
              </div>
              <div className="mt-3 grid md:grid-cols-[1fr_auto] gap-2">
                <Input placeholder="Image URL" value={colImg} onChange={(e)=>setColImg(e.target.value)} />
                <Button onClick={()=>{ if(!colImg) return; addCollectionImage(c.id, colImg); setColImg(""); }}>Add Image</Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border p-4">
        <h2 className="font-medium mb-3">Inventory</h2>
        <div className="space-y-3">
          {state.products.map((p) => (
            <div key={p.id} className="grid grid-cols-1 md:grid-cols-[80px_1fr_160px_160px] gap-3 items-center border rounded-lg p-3">
              <img src={`${p.image}?auto=compress&cs=tinysrgb&w=160`} className="h-16 w-12 object-cover rounded" />
              <div>
                <p className="font-medium">{p.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Price</label>
                <Input type="number" value={p.price} onChange={(e)=>setPrice(p.id, parseFloat(e.target.value)||0)} />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Stock</label>
                <Input type="number" value={p.stock} onChange={(e)=>setStock(p.id, parseInt(e.target.value)||0)} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="font-medium mb-2">Add New Product</h3>
          <div className="grid md:grid-cols-4 gap-2">
            <Input placeholder="Name" value={newName} onChange={(e)=>setNewName(e.target.value)} />
            <Input type="number" placeholder="Price" value={newPrice} onChange={(e)=>setNewPrice(parseFloat(e.target.value)||0)} />
            <Input type="number" placeholder="Stock" value={newStock} onChange={(e)=>setNewStock(parseInt(e.target.value)||0)} />
            <Input placeholder="Image URL" value={newImage} onChange={(e)=>setNewImage(e.target.value)} />
          </div>
          <Button className="mt-3" onClick={()=>{
            if(!newName||!newImage) return;
            addProduct({ id: `p_${Date.now()}`, name: newName, price: newPrice, stock: newStock, image: newImage });
            setNewName(""); setNewPrice(0); setNewStock(0); setNewImage("");
          }}>Add Product</Button>
        </div>
      </section>
    </div>
  );
}
