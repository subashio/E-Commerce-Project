import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ProductTabs({
  description,
  specifications,
}: {
  description: string | TrustedHTML | undefined;
  specifications: Array<any>;
}) {
  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="my-4 w-full gap-4 border-b bg-transparent">
        <TabsTrigger
          className="p-0 text-sm data-[state=active]:text-primary data-[state=active]:underline data-[state=active]:underline-offset-[14px]"
          value="details"
        >
          Product Details
        </TabsTrigger>
        <TabsTrigger
          value="info"
          className="text-sm data-[state=active]:text-primary data-[state=active]:underline data-[state=active]:underline-offset-[14px]"
        >
          Information
        </TabsTrigger>
        <TabsTrigger
          disabled
          value="info-seller"
          className="text-sm data-[state=active]:text-primary data-[state=active]:underline data-[state=active]:underline-offset-[14px]"
        >
          Seller Info
        </TabsTrigger>
      </TabsList>
      <TabsContent value="details" className="mb-10 whitespace-pre-wrap">
        <div
          className="rich-text-content"
          style={{ whiteSpace: "pre-wrap" }}
          dangerouslySetInnerHTML={{ __html: description || "" }}
        ></div>
      </TabsContent>
      <TabsContent value="info" className="mb-10">
        <h1>Specifications</h1>

        <table className="mt-4 w-full">
          {specifications.map((item, i) => (
            <tr
              key={i}
              className={i % 2 === 0 ? "bg-white" : "bg-secondary/10"}
            >
              <td className="border p-2">{item.key}</td>
              <td className="border p-2">{item.value}</td>
            </tr>
          ))}
        </table>
      </TabsContent>
      <TabsContent value="info-seller"></TabsContent>
    </Tabs>
  );
}
